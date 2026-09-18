import mongoose from 'mongoose';
import './env';

export const connectDatabase = async (): Promise<void> => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};
