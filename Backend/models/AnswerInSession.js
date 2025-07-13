const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnswerInSession = sequelize.define('AnswerInSession', {
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
},

quizSessionId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'quiz_session_id',
},

questionId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'question_id',
},

selectedOptionIndex: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'selected_option_index',
},

isCorrect: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  field: 'is_correct',
},

answeredAt: {
  type: DataTypes.DATE,
  allowNull: false,
  field: 'answered_at',
},

}, {
tableName: 'answer_in_session', 
timestamps: true,
createdAt: 'created_at',
updatedAt: false, 
});


module.exports = AnswerInSession;
