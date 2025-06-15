const { User } = require('../models');

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
  const { username, passwordHash, admin = false } = req.body;

  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'Benutzername und Passwort-Hash erforderlich' });
  }

  try {
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
  const { username, passwordHash } = req.body;

  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    // In Produktion mit bcrypt vergleichen
    if (!user || user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

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
