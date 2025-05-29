const User = require('./User');
const Question = require('./Question');
const Option = require('./Option');
const Answer = require('./Answer');
const GameSession = require('./GameSession');
const SessionParticipant = require('./SessionParticipant');

// Hier keine `sequelize.sync()` — nur Imports/Beziehungen

module.exports = {
  User,
  Question,
  Option,
  Answer,
  GameSession,
  SessionParticipant,
};
