const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Validierungs-Middleware
const validate = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next();
};

// Neue Frage erstellen mit Validierung
router.post(
'/',
[
  body('quizRoomId')
    .isInt({ gt: 0 })
    .withMessage('quizRoomId muss eine positive Zahl sein.'),
  body('questionText')
    .isLength({ min: 5 })
    .withMessage('Fragetext muss mindestens 5 Zeichen lang sein.'),
  body('correctAnswerIndex')
    .isInt({ min: 0 })
    .withMessage('correctAnswerIndex muss eine ganze Zahl >= 0 sein.'),
  validate,
],
questionController.createQuestion
);

// Eine Frage abrufen by ID

router.get(
'/:id',
[
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID muss eine positive Zahl sein.'),
  validate,
],
questionController.getQuestionByID  
);


// Alle Fragen zu einem Raum abrufen – quizRoomId als Param validieren
router.get(
'/room/:quizRoomId',
[
  param('quizRoomId')
    .isInt({ gt: 0 })
    .withMessage('quizRoomId muss eine positive Zahl sein.'),
  validate,
],
questionController.getQuestionsByRoom
);

// Frage aktualisieren – PUT /:id mit Validierung
router.put(
  '/:id',
  [
    param('id')
      .isInt({ gt: 0 })
      .withMessage('ID muss eine positive Zahl sein.'),
    body('questionText')
      .optional()
      .isLength({ min: 5 })
      .withMessage('Fragetext muss mindestens 5 Zeichen lang sein.'),
    body('correctAnswerIndex')
      .optional()
      .isInt({ min: 0 })
      .withMessage('correctAnswerIndex muss eine ganze Zahl >= 0 sein.'),
    body('quizRoomId')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('quizRoomId muss eine positive Zahl sein.'),
    validate,
  ],
  questionController.updateQuestion
);

// Frage löschen – id als Param validieren
router.delete(
'/:id',
[
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID muss eine positive Zahl sein.'),
  validate,
],
questionController.deleteQuestion
);

module.exports = router;
