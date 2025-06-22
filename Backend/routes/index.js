//Zentrale Routes Verwaltung für Entschlackung server.js und leichteres nachrüsten von neuen Routen


const userRoutes = require('./userRoutes');
const quizSessionRoutes = require('./quizSessionRoutes');
const quizRoomRoutes = require('./quizRoomRoutes');
const questionRoutes = require('./questionRoutes');
const answerOptionRoutes = require('./answerOptionRoutes');
const answerInSessionRoutes = require('./answerInSessionRoutes');
const reasonRoutes = require('./reasonRoutes');

function registerRoutes(app) {
  app.use('/api/users', userRoutes);
  app.use('/api/sessions', quizSessionRoutes);
  app.use('/api/quizrooms', quizRoomRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/answers', answerOptionRoutes);
  app.use('/api/answers-in-session', answerInSessionRoutes);
  app.use('/api/reasons', reasonRoutes);

  // Optional: Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
}

module.exports = registerRoutes;