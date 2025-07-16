const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'forum_post',
  timestamps: false // wir nutzen das SQL-Feld created_at
});

module.exports = ForumPost;


