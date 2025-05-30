const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Question = require('./Question');
const Option = require('./Option'); 

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id',
    references: {
      model: Question,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  selectedOptionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'selected_option_id',
    references: {
      model: Option,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    field: 'is_correct',
  },
}, {
  tableName: 'answers',
  timestamps: true,
  createdAt: 'answered_at', // Mapped zu SQL-Feld
  updatedAt: false
});

Answer.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

Answer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
  onDelete: 'CASCADE',
});

Answer.belongsTo(Option, {
  foreignKey: 'selectedOptionId',
  as: 'selectedOption',
  onDelete: 'SET NULL',
});

module.exports = Answer;
