// Imports der Modelle
const { sequelize } = require('../config/database');

//alle Modelle zentral importieren und exportieren, damit sie z. B. im Hauptserver oder Services einfach mit require('./models') eingebunden werden können
const User = require('./User');
const Question = require('./Question');
const AnswerOption = require('./AnswerOption');
const AnswerInSession = require('./AnswerInSession');
const QuizRoom = require('./QuizRoom');
const QuizSession = require('./QuizSession');
const Reason = require('./Reason');

// Hier keine `sequelize.sync()` — nur Imports/Beziehungen
module.exports = {
  sequelize, // ❗️DAS HAT GEFEHLT IN DER VORHERIGEN VERSION
  User,
  Question,
  AnswerOption,
  AnswerInSession,
  QuizRoom,
  QuizSession,
  Reason,
};
