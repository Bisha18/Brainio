import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in your environment variables');
    }

    console.log('🔌 Attempting to connect to MongoDB...');

    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    } as ConnectOptions);

    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default connectDB;