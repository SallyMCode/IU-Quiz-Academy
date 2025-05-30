// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  passwordHash: { // Sequelize konvertiert automatisch zu password_hash, wenn underscored: true gesetzt ist
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash', // Dies ist optional, aber nützlich, wenn man den Feldnamen in der Datenbank anpassen möchte
  },
  // created_at wird von Sequelize automatisch hinzugefügt, wenn timestamps: true gesetzt ist
}, {
  tableName: 'users', // sicherstellen, dass der Tabellenname korrekt ist
  timestamps: true, // Fügt createdAt und updatedAt Felder hinzu
  createdAt:'created_at', 
  updatedAt: 'false'
});

module.exports = User;
