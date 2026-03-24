import 'dotenv/config';
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

async function startServer(): Promise<void> {
  const app = express();
  const httpServer = createServer(app);

  // CORS — allow Vercel frontend and local dev
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5000',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(generalLimiter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cases', caseRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Global error handler (must be last)
  app.use(errorHandler);

  // WebSocket server for voice sessions at /api/voice/session/:sessionId
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/api/voice',
  });
  setupVoiceWebSocket(wss);

  const PORT = Number(env.PORT);
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Case Coach AI backend running on port ${PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    // Connect to DB after HTTP server is up so healthcheck passes immediately
    connectDB().catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
