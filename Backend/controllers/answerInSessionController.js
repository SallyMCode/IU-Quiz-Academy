const { AnswerInSession, Question, QuizSession } = require('../models');

// Alle Antworten einer Session abrufen
exports.getAnswersBySession = async (req, res) => {
const { sessionId } = req.params;

try {
  const answers = await AnswerInSession.findAll({
    where: { quizSessionId: sessionId },
    include: [
      { model: Question, as: 'question' },
      { model: QuizSession, as: 'quizSession' }
    ]
  });

  res.json(answers);
} catch (err) {
  console.error('Fehler beim Abrufen der Antworten:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen der Antworten' });
}
};

// Neue Antwort speichern
exports.createAnswer = async (req, res) => {
const { quizSessionId, questionId, selectedOptionIndex, isCorrect } = req.body;

if (
  quizSessionId === undefined ||
  questionId === undefined ||
  selectedOptionIndex === undefined ||
  isCorrect === undefined
) {
  return res.status(400).json({ error: 'Fehlende Felder in der Anfrage' });
}

try {
  const answer = await AnswerInSession.create({
    quizSessionId,
    questionId,
    selectedOptionIndex,
    isCorrect,
    answeredAt: new Date()
  });

  res.status(201).json(answer);
} catch (err) {
  console.error('Fehler beim Speichern der Antwort:', err);
  res.status(500).json({ error: 'Fehler beim Speichern der Antwort' });
}
};

// Einzelne Antwort löschen
exports.deleteAnswer = async (req, res) => {
const { id } = req.params;

try {
  const deleted = await AnswerInSession.destroy({ where: { id } });

  if (!deleted) {
    return res.status(404).json({ error: 'Antwort nicht gefunden' });
  }

  res.json({ message: 'Antwort gelöscht' });
} catch (err) {
  console.error('Fehler beim Löschen der Antwort:', err);
  res.status(500).json({ error: 'Fehler beim Löschen der Antwort' });
}
};
