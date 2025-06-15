const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/quizSessionController');

// Alle Sessions abrufen
router.get('/', quizSessionController.getAllSessions);

// Neue Session starten
router.post('/', quizSessionController.startSession);

// Einzelne Session abrufen
router.get('/:id', quizSessionController.getSessionById);

// Session beenden
router.patch('/:id/end', quizSessionController.endSession);

module.exports = router;
