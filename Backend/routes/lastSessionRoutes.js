const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// Temporär: User-ID = 1
router.get('/', async (req, res) => {
  const userId = 1; // später mit req.user.id ersetzen

  try {
    const [lastSession] = await sequelize.query(`
      SELECT 
        qs.end_time AS date,
        qr.title AS topic
      FROM quiz_session qs
      JOIN quiz_room qr ON qr.id = qs.quiz_room_id
      WHERE qs.user_id = ? AND qs.state = 'CLOSED'
      ORDER BY qs.end_time DESC
      LIMIT 1
    `, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!lastSession) {
      return res.json({ date: null, topic: null });
    }

    res.json(lastSession);
  } catch (err) {
    console.error('Fehler bei letzter Session:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

module.exports = router;
