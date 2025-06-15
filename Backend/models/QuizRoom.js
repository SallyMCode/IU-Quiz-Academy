const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const QuizRoom = sequelize.define('QuizRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
    creatorId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Entspricht ON DELETE SET NULL
    references: {
      model: User, // Referenziert das User-Modell
      key: 'id',
    }
  },

}, {
  tableName: 'quiz_room',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

QuizRoom.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator',
  onDelete: 'SET NULL',
});

module.exports = QuizRoom;