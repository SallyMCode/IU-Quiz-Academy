require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const registerRoutes = require('./routes');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const authenticateToken = require('./middlewares/authenticateToken'); 

const app = express();

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

registerRoutes(app); // Hier sollten Router inkl. AuthMiddleware korrekt gemountet sein

// Health-Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error Handler nach allen Routen
app.use(errorHandler);

module.exports = app;
