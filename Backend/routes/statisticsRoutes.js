const express = require('express');
const router = express.Router();
const { sequelize } = require('../models'); 

// GET /api/statistics
router.get('/', async (req, res) => {
const userId = req.user?.id || 1; // später mit echter Auth ersetzen – temporär z. B. 1

try {
  const [totalQuizzes] = await sequelize.query(`
    SELECT COUNT(*) AS total_quizzes
    FROM quiz_session
    WHERE user_id = ? AND state = 'CLOSED'
  `, { replacements: [userId], type: sequelize.QueryTypes.SELECT });

  const [successRate] = await sequelize.query(`
    SELECT 
      ROUND(100.0 * SUM(is_correct) / COUNT(*), 2) AS success_rate
    FROM answer_in_session
    JOIN quiz_session ON quiz_session.id = answer_in_session.quiz_session_id
    WHERE quiz_session.user_id = ? AND quiz_session.state = 'CLOSED'
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