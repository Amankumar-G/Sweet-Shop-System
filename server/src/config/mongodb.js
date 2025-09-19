import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const dbLink = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbLink);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB Connection Failed:', err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log(' MongoDB Disconnected');
  } catch (err) {
    console.error(' Disconnection Error:', err);
  }
};

export default {
  connectDB,
  disconnectDB,
};
