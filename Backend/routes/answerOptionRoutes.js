const express = require('express');
const router = express.Router();
const answerOptionController = require('../controllers/answerOptionController');

// Neue Antwortoption erstellen
router.post('/', answerOptionController.createAnswerOption);

// Alle Optionen zu einer Frage abrufen
router.get('/question/:questionId', answerOptionController.getOptionsByQuestion);

// Eine Antwortoption löschen
router.delete('/:id', answerOptionController.deleteAnswerOption);

module.exports = router;
