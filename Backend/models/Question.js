const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizRoom = require('./QuizRoom'); // Importiert das Modell für die Assoziation

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  quizRoomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quiz_room_id',
    },

  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text', 
  },

  correctAnswerIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'correct_answer_index', 
  },
 
}, {
  tableName: 'question',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Assoziation
Question.belongsTo(QuizRoom, {
  foreignKey:'quizRoomId',
    onDelete: 'CASCADE', 
  }),
 
module.exports = Question;
