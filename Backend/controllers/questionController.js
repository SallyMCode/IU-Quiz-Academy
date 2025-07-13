const { Question } = require('../models');

// Neue Frage erstellen
exports.createQuestion = async (req, res) => {
const { quizRoomId, questionText, correctAnswerIndex } = req.body;

if (!quizRoomId || !questionText || correctAnswerIndex === undefined) {
  return res.status(400).json({
    error: 'quizRoomId, questionText und correctAnswerIndex sind erforderlich.',
  });
}

try {
  const question = await Question.create({
    quizRoomId,
    questionText,
    correctAnswerIndex,
  });

  res.status(201).json(question);
} catch (err) {
  console.error('Fehler beim Erstellen der Frage:', err);
  res.status(500).json({ error: 'Fehler beim Erstellen der Frage' });
}
};

// Alle Fragen eines Quiz-Raums abrufen
exports.getQuestionsByRoom = async (req, res) => {
const { quizRoomId } = req.params;

try {
  const questions = await Question.findAll({
    where: { quizRoomId },
    order: [['id', 'ASC']],
  });

  res.json(questions);
} catch (err) {
  console.error('Fehler beim Abrufen der Fragen:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen der Fragen' });
}
};

// Frage löschen
exports.deleteQuestion = async (req, res) => {
const { id } = req.params;

try {
  const deleted = await Question.destroy({ where: { id } });

  if (!deleted) {
    return res.status(404).json({ error: 'Frage nicht gefunden' });
  }

  res.json({ message: 'Frage gelöscht' });
} catch (err) {
  console.error('Fehler beim Löschen der Frage:', err);
  res.status(500).json({ error: 'Fehler beim Löschen der Frage' });
}
};