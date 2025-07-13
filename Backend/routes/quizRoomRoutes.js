const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const quizRoomController = require('../controllers/quizRoomController');

// Middleware zur Fehlerprüfung
const validate = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next();
};

// Alle Quiz-Räume abrufen
router.get('/', quizRoomController.getAllQuizRooms);

// Neuen Raum erstellen – Validierung
router.post(
'/',
[
  body('title')
    .isLength({ min: 3 })
    .withMessage('Der Titel muss mindestens 3 Zeichen lang sein.'),
  body('public')
    .optional()
    .isBoolean()
    .withMessage('public muss true oder false sein.'),
  body('creatorId')
    .optional()
    .isInt()
    .withMessage('creatorId muss eine gültige ID (Zahl) sein.'),
  validate,
],
quizRoomController.createQuizRoom
);

// Einzelnen Raum abrufen – ID prüfen
router.get(
'/:id',
[
  param('id')
    .isInt()
    .withMessage('Die ID muss eine Zahl sein.'),
  validate,
],
quizRoomController.getQuizRoomById
);

// Raum löschen – ID prüfen
router.delete(
'/:id',
[
  param('id')
    .isInt()
    .withMessage('Die ID muss eine Zahl sein.'),
  validate,
],
quizRoomController.deleteQuizRoom
);

// Raum aktualisieren – Validierung
router.put(
'/:id',
[
  param('id')
    .isInt()
    .withMessage('Die ID muss eine Zahl sein.'),
  body('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Der Titel muss mindestens 3 Zeichen lang sein.'),
  body('public')
    .optional()
    .isBoolean()
    .withMessage('public muss true oder false sein.'),
  body('creatorId')
    .optional()
    .isInt()
    .withMessage('creatorId muss eine gültige ID (Zahl) sein.'),
  validate,
],
quizRoomController.updateQuizRoom
);

module.exports = router;
