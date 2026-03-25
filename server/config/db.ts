import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
  });
  console.log('MongoDB connected');
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
