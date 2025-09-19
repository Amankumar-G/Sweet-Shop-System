import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Server is live... '));

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
