const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnswerOption = sequelize.define('AnswerOption', {
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
},

questionId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'question_id',
},

optionIndex: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'option_index',  
},

optionText: {
  type: DataTypes.TEXT,
  allowNull: false,
  field: 'option_text',
},

}, {
tableName: 'answer_option',
timestamps: false,
});

module.exports = AnswerOption;
