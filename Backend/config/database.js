// Modul "path" wird benötigt, um Dateipfade plattformübergreifend korrekt zu behandeln
const path = require('path');

// Lädt Umgebungsvariablen aus der .env-Datei im übergeordneten Verzeichnis
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import der Sequelize-Bibliothek für ORM (Object-Relational Mapping)
const { Sequelize } = require('sequelize');

// Neue Sequelize-Instanz zur Verbindung mit der Datenbank (PostgreSQL über DATABASE_URL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  define: {
    timestamps: true,   // Automatisch createdAt/updatedAt-Felder in Tabellen
    underscored: true   // Spaltennamen mit Unterstrichen (z.B. created_at statt createdAt)
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false
  }
});

// Funktion zur Überprüfung der Datenbankverbindung
async function testConnection() {
  try {
    await sequelize.authenticate(); // Testet, ob die Verbindung erfolgreich hergestellt werden kann
    console.log('Verbindung zur Datenbank erfolgreich hergestellt.');
    return true;
  } catch (error) {
    // Fehler beim Verbindungsaufbau wird ausgegeben
    console.error('Verbindung zur Datenbank fehlgeschlagen:', error);
    return false;
  }
}

// Exportiert sequelize-Instanz und Testfunktion für andere Module
module.exports = {
  sequelize,
  testConnection
};
