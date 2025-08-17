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
passwordHash: { 
  type: DataTypes.STRING(255),
  allowNull: false,
  field: 'password_hash'
},

admin: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: false,
}

// created_at wird von Sequelize automatisch hinzugefügt, wenn timestamps: true gesetzt ist
}, {
tableName: 'user', // sicherstellen, dass der Tabellenname korrekt ist
timestamps: true, // Fügt createdAt und updatedAt Felder hinzu
createdAt:'created_at', 
updatedAt: false,
});

module.exports = User;

