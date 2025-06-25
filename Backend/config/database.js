const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb', // Wichtig: mariadb angeben
    port: process.env.DB_PORT || 3306, // Standard-Port für Webanwendungen
    logging: false, // Log-Ausgaben in der Konsole
    define: {
      timestamps: true, // Sequelize fügt automatisch createdAt und updatedAt hinzu
      underscored: true, // Benutzt snake_case für Spaltennamen in der DB (z.B. created_at statt createdAt)
    }
  }
);

// Teste die Verbindung
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Verbindung zur Datenbank erfolgreich hergestellt.');
    return true;
  } catch (error) {
    console.error('Verbindung zur Datenbank fehlgeschlagen:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection
};
