const { User } = require('../models');
const bcrypt = require('bcrypt');

// Alle Nutzer abrufen
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'admin'], // kein passwordHash
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler beim Abrufen der Nutzer' });
  }
};

// Neuen Nutzer erstellen
exports.createUser = async (req, res) => {
  const { username, password, admin = false } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10); // sicher hashen
    const newUser = await User.create({ username, passwordHash, admin });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      admin: newUser.admin,
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Nutzers' });
  }
};

// Login-Funktion
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Token erzeugen 
    res.json({
      message: 'Login erfolgreich',
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

// Nutzer löschen
exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Nutzer nicht gefunden' });
    }

    await user.destroy();
    res.json({ message: 'Nutzer erfolgreich gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Nutzers' });
  }
};

