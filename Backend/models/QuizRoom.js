const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
  },

}, {
tableName: 'quiz_room',
timestamps: true,
createdAt: 'created_at',
updatedAt: false,
});

module.exports = QuizRoom;