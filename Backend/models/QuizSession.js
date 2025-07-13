const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizSession = sequelize.define('QuizSession', {
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
},

userId: {
  type: DataTypes.INTEGER,
  field: 'user_id',
},

quizRoomId: {
  type: DataTypes.INTEGER,
  field: 'quiz_room_id',
  },

beginTime: {
  type: DataTypes.DATE,
  field: 'begin_time',
},

endTime: {
  type: DataTypes.DATE,
  field: 'end_time',
},

state: {
  type: DataTypes.ENUM('CLOSED', 'IN_PROGRESS'),
  allowNull: false,
  defaultValue: 'IN_PROGRESS',
  field: 'state',
},

score: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
  field: 'score',
},

}, {
tableName: 'quiz_session',
timestamps: true,
createdAt: 'joined_at',
updatedAt: false,
});


module.exports = QuizSession;