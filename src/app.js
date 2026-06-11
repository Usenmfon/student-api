const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const swaggerDocument = require('./config/swagger');
const connectDB = require('./config/db');
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
      docs: '/api-docs',
    },
  });
});

app.get('/api-docs.json', (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.get(['/api-docs', '/api-docs/'], (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Management API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fafafa; }
      .swagger-ui .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'StandaloneLayout'
        });
      };
    </script>
  </body>
</html>`);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API health check passed',
    data: {
      status: 'ok',
      database:
        mongoose.connection.readyState === 1
          ? 'connected'
          : 'not connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

const requireDatabase = async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: `Database connection failed: ${error.message}`,
    });
  }
};

app.use('/api/auth', requireDatabase);
app.use('/api/students', requireDatabase);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
