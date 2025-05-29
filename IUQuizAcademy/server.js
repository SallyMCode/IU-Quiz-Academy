const express = require('express');
const { sequelize, testConnection } = require('./config/database');
const { User, Question, Option, Answer, GameSession, SessionParticipant } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000; // Standardport 3000 oder Umgebungsvariable PORT

app.use(express.json()); // Für das Parsen von JSON-Anfragen im Request Body

// Datenbankverbindung testen und Server starten
async function startServer() {
  const isConnected = await testConnection();
  if (isConnected) {
    // Sequelize kann die Datenbankstruktur automatisch synchronisieren.
    // ACHTUNG: `alter: true` versucht, die Tabelle an das Modell anzupassen, ohne Daten zu löschen.
    // `force: true` würde die Tabelle bei jedem Start löschen und neu erstellen (NICHT in Produktion verwenden!).
    // Für ein bestehendes Schema ist `alter: true` oder das Weglassen von `sync` oft besser,
    // wenn Migrationen manuell verwaltet werden.
    
    await sequelize.sync({ alter: true }) // Synchronisiert die Modelle mit der Datenbank
      .then(() => {
        console.log('Datenbank synchronisiert.');
      })
      .catch(err => {
        console.error('Fehler bei der Synchronisierung der Datenbank:', err);
      });

    // Hier deine API-Routen definieren
    app.get('/', (req, res) => {
      res.send('Willkommen zur Quiz-API!');
    });

    // Beispiel-Route: Alle Nutzer abrufen
    app.get('/users', async (req, res) => {
      try {
        const users = await User.findAll();
        res.json(users);
      } catch (error) {
        console.error('Fehler beim Abrufen der Nutzer:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
      }
    });

// Beispiel-Route: Einen neuen Nutzer erstellen
app.post('/users', async (req, res) => {
  const { username, passwordHash } = req.body;

  // Eingabe prüfen, bevor etwas gespeichert wird!
  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'Benutzername und Passwort-Hash sind erforderlich.' });
  }

  try {
    const newUser = await User.create({ username, passwordHash });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Fehler beim Erstellen des Nutzers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  } else {
    console.log('Server konnte nicht gestartet werden, da die Datenbankverbindung fehlgeschlagen ist.');
  }
}

startServer();