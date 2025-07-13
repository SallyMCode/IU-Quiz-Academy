const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Temporäre Lösung: immer Benutzer mit ID 1
router.get('/', async (req, res) => {
const userId = 1; // später durch req.user.id ersetzen

try {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username']
  });

  if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

  res.json(user);
} catch (error) {
  console.error('Fehler beim Laden des Benutzers:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
});

module.exports = router;