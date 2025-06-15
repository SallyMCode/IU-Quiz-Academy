const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Neue Frage erstellen
router.post('/', questionController.createQuestion);

// Alle Fragen zu einem Raum abrufen
router.get('/room/:quizRoomId', questionController.getQuestionsByRoom);

// Eine Frage löschen
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
