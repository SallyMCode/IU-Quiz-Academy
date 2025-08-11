const express = require('express');
const router = express.Router();
const { sequelize } = require('../models'); 

// GET /api/statistics
router.get('/', async (req, res) => {
  const userId = parseInt(req.query.userId, 10); // UserID aus Query-Parameter

  if (!userId) {
    return res.status(400).json({ error: 'UserID fehlt oder ungültig' });
  }

  try {
    const [totalQuizzes] = await sequelize.query(`
      SELECT COUNT(*) AS total_quizzes
      FROM quiz_session
      WHERE user_id = ? AND state = 'CLOSED'
    `, { replacements: [userId], type: sequelize.QueryTypes.SELECT });

    const [successRate] = await sequelize.query(`
      SELECT 
        CASE 
          WHEN SUM(max_score) > 0 
          THEN ROUND(100.0 * SUM(score) / SUM(max_score), 2)
          ELSE 0
        END AS success_rate
      FROM quiz_session
      WHERE user_id = ?
    `, { replacements: [userId], type: sequelize.QueryTypes.SELECT });

    const [totalPoints] = await sequelize.query(`
      SELECT SUM(score) AS total_points
      FROM quiz_session
      WHERE user_id = ? AND state = 'CLOSED'
    `, { replacements: [userId], type: sequelize.QueryTypes.SELECT });

    res.json({
      totalQuizzes: totalQuizzes.total_quizzes || 0,
      successRate: successRate.success_rate || 0,
      totalPoints: totalPoints.total_points || 0
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Statistik:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

module.exports = router;