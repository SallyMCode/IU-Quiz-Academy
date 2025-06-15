const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizSession = require('./QuizSession');
const Question = require('./Question');

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
    references: {
      model: QuizSession,
      key: 'id',
    },
  },

  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id',
    references: {
      model: Question,
      key: 'id',
    },
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

// Assoziationen
AnswerInSession.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
  onDelete: 'CASCADE',
});

AnswerInSession.belongsTo(QuizSession, {
  foreignKey: 'quizSessionId',
  as: 'quizSession',
  onDelete: 'CASCADE',
});

module.exports = AnswerInSession;
