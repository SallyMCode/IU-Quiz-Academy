const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ForumThread = sequelize.define('ForumThread', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'forum_thread',
  timestamps: false // Da du created_at manuell verwaltest
});

module.exports = ForumThread;
