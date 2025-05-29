const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Question = require('./Question');

const Option = sequelize.define('Option', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id',
    references: {
      model: Question,
      key: 'id',
    },
    onDelete: 'CASCADE', // wichtig für FK
  },
  optionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'option_text',
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_correct',
  },
}, {
  tableName: 'options',
  timestamps: false
});

// Assoziationen korrekt definieren
Option.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
  onDelete: 'CASCADE',
});
Question.hasMany(Option, {
  foreignKey: 'questionId',
  as: 'options'
});

module.exports = Option;
