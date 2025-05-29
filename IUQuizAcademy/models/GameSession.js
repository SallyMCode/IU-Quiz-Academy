const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const GameSession = sequelize.define('GameSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  sessionName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'session_name',
  },
  
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },

}, {
  tableName: 'game_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

GameSession.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
  onDelete: 'SET NULL',
});
User.hasMany(GameSession, {
  foreignKey: 'createdBy',
  as: 'createdSessions'
});

module.exports = GameSession;