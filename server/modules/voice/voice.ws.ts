import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import WebSocketNode from 'ws';
import { env } from '../../config/env.js';
import { Session } from '../../models/Session.js';
import { Case } from '../../models/Case.js';
import { INTERVIEWER_SYSTEM_PROMPT } from '../../ai/prompts.js';
import { appendTranscript } from '../sessions/session.service.js';
import { CaseType } from '../../models/Case.js';

const OPENAI_REALTIME_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

function extractToken(req: IncomingMessage): string | null {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  return url.searchParams.get('token');
}

function extractSessionId(req: IncomingMessage): string | null {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  return url.searchParams.get('sessionId');
}

function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

export function setupVoiceWebSocket(wss: WebSocketServer): void {
  wss.on('connection', (clientWs: WebSocket, req: IncomingMessage) => {
    handleConnection(clientWs, req).catch((err) => {
      console.error('Voice WS unhandled error:', err);
      sendToClient(clientWs, { type: 'error', message: String(err?.message ?? 'Internal voice service error') });
      clientWs.close(4000, String(err?.message ?? 'Internal error').slice(0, 123));
    });
  });
}

async function handleConnection(clientWs: WebSocket, req: IncomingMessage): Promise<void> {
    // Authenticate
    const token = extractToken(req);
    if (!token) {
      clientWs.close(4001, 'Missing token');
      return;
    }

    const userId = verifyToken(token);
    if (!userId) {
      clientWs.close(4001, 'Invalid token');
      return;
    }

    // Load session and case
    const sessionId = extractSessionId(req);
    if (!sessionId) {
      clientWs.close(4002, 'Missing session ID');
      return;
    }

    const session = await Session.findOne({ _id: sessionId, userId }).populate('caseId');
    if (!session) {
      clientWs.close(4003, 'Session not found');
      return;
    }

    if (session.status !== 'active') {
      clientWs.close(4004, 'Session is not active');
      return;
    }

    // Fix 2: null-check caseDoc in case the referenced Case was deleted
    const caseDoc = session.caseId as unknown as InstanceType<typeof Case> | null;
    if (!caseDoc) {
      clientWs.close(4005, 'Case not found');
      return;
    }

    // Build system prompt
    const systemPrompt = INTERVIEWER_SYSTEM_PROMPT(
      caseDoc.title,
      caseDoc.scenario,
      caseDoc.keyDataPoints,
      caseDoc.type as CaseType,
      session.config.difficulty,
      session.config.interviewerStyle
    );

    // Fail fast if no API key configured
    if (!env.OPENAI_API_KEY) {
      sendToClient(clientWs, { type: 'error', message: 'OPENAI_API_KEY is not configured on the server' });
      clientWs.close();
      return;
    }

    // Connect to OpenAI Realtime API
    const openaiWs = new WebSocketNode(OPENAI_REALTIME_URL, {
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    });

    let openaiReady = false;

    // Fix 3: timeout if OpenAI never responds
    const openaiTimeout = setTimeout(() => {
      if (!openaiReady) {
        sendToClient(clientWs, { type: 'error', message: 'AI service connection timed out' });
        openaiWs.terminate();
        clientWs.close(4006, 'AI connection timeout');
      }
    }, 10000);

    openaiWs.on('open', () => {
      clearTimeout(openaiTimeout);
      openaiReady = true;

      // Configure the session
      const sessionUpdate = {
        type: 'session.update',
        session: {
          modalities: ['text', 'audio'],
          instructions: systemPrompt,
          voice: 'alloy',
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: { model: 'whisper-1' },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
          },
        },
      };

      openaiWs.send(JSON.stringify(sessionUpdate));
    });

    // Forward OpenAI events to client
    openaiWs.on('message', async (data: Buffer) => {
      try {
        const event = JSON.parse(data.toString());

        switch (event.type) {
          case 'session.updated':
            // Session is configured — trigger AI greeting and tell client we're ready
            openaiWs.send(JSON.stringify({ type: 'response.create' }));
            sendToClient(clientWs, { type: 'session_ready' });
            break;
          case 'response.audio.delta':
            // Stream AI audio chunk to client
            sendToClient(clientWs, {
              type: 'audio_chunk',
              data: event.delta,
            });
            break;

          case 'response.audio_transcript.delta':
            // Partial AI transcript — forward for live display
            sendToClient(clientWs, {
              type: 'transcript_delta',
              role: 'interviewer',
              text: event.delta,
            });
            break;

          case 'response.audio_transcript.done':
            // Final AI transcript turn — save to DB
            if (event.transcript) {
              sendToClient(clientWs, {
                type: 'transcript',
                role: 'interviewer',
                text: event.transcript,
              });
              // Fix 1: don't let DB errors crash the WS handler
              await appendTranscript(sessionId, {
                role: 'interviewer',
                text: event.transcript,
                timestamp: new Date(),
              }).catch((e) => console.error('appendTranscript (interviewer) failed:', e));
            }
            break;

          case 'conversation.item.input_audio_transcription.completed':
            // Candidate speech transcribed — save and display
            if (event.transcript) {
              sendToClient(clientWs, {
                type: 'transcript',
                role: 'candidate',
                text: event.transcript,
              });
              // Fix 1: don't let DB errors crash the WS handler
              await appendTranscript(sessionId, {
                role: 'candidate',
                text: event.transcript,
                timestamp: new Date(),
              }).catch((e) => console.error('appendTranscript (candidate) failed:', e));
            }
            break;

          case 'error':
            sendToClient(clientWs, { type: 'error', message: event.error?.message ?? 'OpenAI error' });
            break;

          default:
            break;
        }
      } catch {
        // ignore parse errors on non-JSON messages
      }
    });

    openaiWs.on('error', (err) => {
      console.error('OpenAI WS error:', err.message);
      sendToClient(clientWs, { type: 'error', message: 'Voice service connection error' });
    });

    openaiWs.on('close', () => {
      sendToClient(clientWs, { type: 'session_ended' });
      clientWs.close();
    });

    // Handle messages from the client (browser)
    clientWs.on('message', (data: Buffer) => {
      if (!openaiReady) return;

      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'audio_chunk') {
          // Forward audio to OpenAI
          const audioAppend = {
            type: 'input_audio_buffer.append',
            audio: message.data,
          };
          openaiWs.send(JSON.stringify(audioAppend));
        } else if (message.type === 'audio_commit') {
          // Client signals end of speech turn
          openaiWs.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
          openaiWs.send(JSON.stringify({ type: 'response.create' }));
        } else if (message.type === 'interrupt') {
          // Cancel current AI response
          openaiWs.send(JSON.stringify({ type: 'response.cancel' }));
        } else if (message.type === 'end_session') {
          openaiWs.close();
          clientWs.close();
        }
      } catch {
        // Handle raw binary audio (PCM16 directly)
        if (Buffer.isBuffer(data) && openaiReady) {
          const audioAppend = {
            type: 'input_audio_buffer.append',
            audio: data.toString('base64'),
          };
          openaiWs.send(JSON.stringify(audioAppend));
        }
      }
    });

    clientWs.on('close', () => {
      if (openaiWs.readyState === WebSocketNode.OPEN) {
        openaiWs.close();
      }
    });

    clientWs.on('error', (err) => {
      console.error('Client WS error:', err.message);
      openaiWs.close();
    });
}

function sendToClient(ws: WebSocket, payload: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}
