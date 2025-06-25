require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const { User, AnswerInSession, AnswerOption, Question, QuizRoom, QuizSession, Reason } = require('./models');
const registerRoutes = require('./routes');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(errorHandler);

// Routen
registerRoutes(app);

// Health-Check (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
