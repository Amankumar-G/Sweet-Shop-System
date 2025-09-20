import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from './config/corsConfig.js';
import { displayStartupMessage } from './config/start.js';
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Startup message
displayStartupMessage();

// Middleware
app.use(express.json());
app.use(cors);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.get('/', (req, res) => res.send('Server is live... '));
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ title: '404', message: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  });
});

export default app;
