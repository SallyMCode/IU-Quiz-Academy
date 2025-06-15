const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Question = require('./Question');

const Reason = sequelize.define('Reason', {
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
  },

  reasonText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'reason_text',
  },

  reasonIndex: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    field: 'reason_index',
  },
}, {
  tableName: 'reason',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Reason.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
  onDelete: 'CASCADE',
});

module.exports = Reason;
