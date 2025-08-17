// Zentrale Routes Verwaltung für Entschlackung server.js und leichteres nachrüsten von neuen Routen
const userRoutes = require('./userRoutes');
const quizSessionRoutes = require('./quizSessionRoutes');
const quizRoomRoutes = require('./quizRoomRoutes');
const questionRoutes = require('./questionRoutes');
const answerOptionRoutes = require('./answerOptionRoutes');
const answerInSessionRoutes = require('./answerInSessionRoutes');
const reasonRoutes = require('./reasonRoutes');
const statisticsRoutes = require('./statisticsRoutes');
const userMeRoutes = require('./userMeRoutes');
const lastSessionRoutes = require('./lastSessionRoutes');
const forumPostRoutes = require('./forumPostRoutes');
const forumThreadRoutes = require('./forumThreadsRoutes');

function registerRoutes(app) {
  app.use('/api/users', userRoutes);
  app.use('/api/quizsessions', quizSessionRoutes);
  app.use('/api/quizrooms', quizRoomRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/answeroptions', answerOptionRoutes);
  app.use('/api/answers-in-session', answerInSessionRoutes);
  app.use('/api/reasons', reasonRoutes);
  app.use('/api/statistics', statisticsRoutes);
  app.use('/api/users/me', userMeRoutes);
  app.use('/api/sessions/last', lastSessionRoutes);
  app.use('/api/forum-posts', forumPostRoutes);
  app.use('/api/forum-threads', forumThreadRoutes);

}

module.exports = registerRoutes;