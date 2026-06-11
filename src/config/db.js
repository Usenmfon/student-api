const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_MONGODB_URI is missing. Add it to student_api/.env or Vercel Environment Variables');
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        cachedConnection = conn.connection;
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return cachedConnection;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
      });
  }

  return cachedPromise;
};

module.exports = connectDB;
