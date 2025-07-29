const express = require('express');
const router = express.Router();
const reasonController = require('../controllers/reasonController');

// Neue Begründung
router.post('/', reasonController.createReason);

// Begründungen zu einer Frage
router.get('/question/:questionId', reasonController.getReasonsByQuestion);

// Begründung aktualisieren
router.put('/:id', reasonController.updateReason);

// Begründung löschen
router.delete('/:id', reasonController.deleteReason);

module.exports = router;
