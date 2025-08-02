const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/quizSessionController');

// Alle Sessions abrufen
router.get('/', quizSessionController.getAllSessions);
router.get('/userroom', quizSessionController.getUserRoomSessions);

// Neue Session starten
router.post('/', quizSessionController.startSession);

// Einzelne Session abrufen
router.get('/:id', quizSessionController.getSessionById);

// Session beenden
router.patch('/:id/end', quizSessionController.endSession);
router.patch('/:id/score', quizSessionController.updateScore);
router.patch('/:id/lastaction', quizSessionController.updateLastAction);
router.patch('/:id/currentquestion', quizSessionController.updateCurrentQuestion);

module.exports = router;
