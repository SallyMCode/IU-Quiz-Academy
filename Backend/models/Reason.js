const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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

module.exports = Reason;
