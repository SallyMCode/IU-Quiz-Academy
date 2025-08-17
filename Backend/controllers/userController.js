const { User } = require('../models');
// Passwort wird gehasht (verschlüsselt) mit bcrypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JSON Web Token für Authentifizierung

// Alle Nutzer abrufen (ohne Passwort-Hash)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'admin'], // Passwort wird hier bewusst nicht zurückgegeben
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler beim Abrufen der Nutzer' });
  }
};

// Neuen Nutzer anlegen mit gehashtem Passwort
exports.createUser = async (req, res) => {
  const { username, password, admin = false } = req.body;

  // Validierung: Username und Passwort müssen vorhanden sein
  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    // Passwort sicher mit bcrypt hashen, 10 Runden Salz hinzufügen
    const passwordHash = await bcrypt.hash(password, 10);
    // Neuen Nutzer speichern
    const newUser = await User.create({ username, passwordHash, admin });

    // Erfolgreiche Antwort ohne Passwort-Hash zurückgeben
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      admin: newUser.admin,
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Nutzers' });
  }
};

// Nutzer-Login mit Passwortprüfung und JWT-Ausgabe
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validierung: Username und Passwort erforderlich
  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    // Nutzer anhand Username suchen
    const user = await User.findOne({ where: { username } });

    // Falls Nutzer nicht existiert, 401 Unauthorized
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Passwort mit bcrypt vergleichen (eingehendes Klartext-Passwort vs. gespeicherter Hash)
    //const hash = await bcrypt.hash(user.passwordHash, 10); // Hier wird der Hash des gespeicherten Passworts generiert
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen mit Nutzer-ID als Payload und Ablaufzeit von 1 Stunde
    const token = jwt.sign(
      { id: user.id },                     // Payload (Daten im Token)
      process.env.JWT_SECRET,             // Geheim aus .env Datei
      { expiresIn: '1h' }                 // Ablauf nach 1 Stunde
    );

    // Erfolgreiche Antwort mit Token und Nutzerinfos zurückgeben
    res.json({
      message: 'Login erfolgreich',
      token,
      user: {
        id: user.id,
        username: user.username,
        admin: user.admin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Login' });
  }
};

// Nutzer löschen anhand ID aus URL-Parameter
exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    // Nutzer anhand Primärschlüssel suchen
    const user = await User.findByPk(userId);

    // Wenn Nutzer nicht gefunden, 404 zurückgeben
    if (!user) {
      return res.status(404).json({ error: 'Nutzer nicht gefunden' });
    }

    // Nutzer löschen
    await user.destroy();
    res.json({ message: 'Nutzer erfolgreich gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Nutzers' });
  }
};

// Nutzer anhand ID abrufen
exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'admin'],
    });
    if (!user) {
      return res.status(404).json({ error: 'Nutzer nicht gefunden' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen des Nutzers' });
  }
};
