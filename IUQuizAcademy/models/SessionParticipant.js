const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const GameSession = require('./GameSession'); 

const SessionParticipant = sequelize.define('SessionParticipant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    field: 'session_id',
    references: {
      model: GameSession,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'session_participants',
  timestamps: true,
  createdAt: 'joined_at', // Richtiger Zeitstempel-Name
  updatedAt: false,
});

SessionParticipant.belongsTo(GameSession, {
  foreignKey: 'sessionId',
  as: 'session',
  onDelete: 'CASCADE',
});

SessionParticipant.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});



module.exports = SessionParticipant;