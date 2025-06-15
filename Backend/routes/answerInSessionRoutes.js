const express = require('express');
const router = express.Router();
const answerInSessionController = require('../controllers/answerInSessionController');

// Alle Antworten einer Session abrufen
router.get('/session/:sessionId', answerInSessionController.getAnswersBySession);

// Neue Antwort speichern
router.post('/', answerInSessionController.createAnswer);

// Einzelne Antwort löschen
router.delete('/:id', answerInSessionController.deleteAnswer);

module.exports = router;
