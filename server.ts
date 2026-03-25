import 'dotenv/config';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { env } from './server/config/env.js';
import { connectDB } from './server/config/db.js';
import { errorHandler } from './server/middleware/errorHandler.js';
import { generalLimiter } from './server/middleware/rateLimiter.js';
import authRoutes from './server/modules/auth/auth.routes.js';
import caseRoutes from './server/modules/cases/case.routes.js';
import sessionRoutes from './server/modules/sessions/session.routes.js';
import reportRoutes from './server/modules/reports/report.routes.js';
import analyticsRoutes from './server/modules/analytics/analytics.routes.js';
import { setupVoiceWebSocket } from './server/modules/voice/voice.ws.js';

const app = express();
const httpServer = createServer(app);

// Required so express-rate-limit reads client IP correctly behind Railway/Vercel proxy
app.set('trust proxy', 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(generalLimiter);
app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

// Health check — no DB required
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const wss = new WebSocketServer({ server: httpServer, path: '/api/voice' });
setupVoiceWebSocket(wss);

const PORT = Number(env.PORT);
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`server listening on ${PORT}`);
  connectDB().catch((err) => {
    console.error('MongoDB connection failed (server stays up):', err.message);
  });
});
