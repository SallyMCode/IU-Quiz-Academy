// Imports
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const { User, AnswerInSession, AnswerOption, Question, QuizRoom, QuizSession, Reason } = require('./models');
const registerRoutes = require('./routes'); //  zentrale Route-Registrierung
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');


// Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(requestLogger);
app.use(express.json()); // JSON-Body parser
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(errorHandler);

// API-Routen einbinden
registerRoutes(app);

// Health-Check (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Server starten
async function startServer() {
  const isConnected = await testConnection();
  if (isConnected) {
    try {
      await sequelize.sync({ alter: true }); // Modelle mit DB synchronisieren
      console.log('Datenbank verbunden & synchronisiert.');

      app.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Fehler beim Start:', err);
    }
  } else {
    console.error('DB-Verbindung fehlgeschlagen. Server wird nicht gestartet.');
  }
}

startServer();
