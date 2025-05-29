const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Importiert das User-Modell für die Assoziation

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    fiel: 'question_text', 
  },
  correctAnswer: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'correct_answer', 
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Assoziation definieren
Question.belongsTo(User, {foreignKey: {
    name: 'creatorId',
    allowNull: true,
    field: 'creator_id',
    onDelete: 'SET NULL'
  },
  as: 'creator'});

User.hasMany(Question, { foreignKey: 'creatorId', as: 'questionsCreated' });

module.exports = Question;
