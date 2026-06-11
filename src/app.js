const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management API is running',
    data: {
      docs: 'See README.md for API documentation',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API health check passed',
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
