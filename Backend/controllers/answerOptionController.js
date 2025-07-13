const { AnswerOption } = require('../models');

// Neue Antwortoption erstellen
exports.createAnswerOption = async (req, res) => {
const { questionId, optionIndex, optionText } = req.body;

if (!questionId || optionIndex === undefined || !optionText) {
  return res.status(400).json({
    error: 'questionId, optionIndex und optionText sind erforderlich.',
  });
}

try {
  const option = await AnswerOption.create({
    questionId,
    optionIndex,
    optionText,
  });

  res.status(201).json(option);
} catch (err) {
  console.error('Fehler beim Erstellen der Antwortoption:', err);
  res.status(500).json({ error: 'Fehler beim Erstellen der Antwortoption' });
}
};

// Alle Antwortoptionen zu einer Frage abrufen
exports.getOptionsByQuestion = async (req, res) => {
const { questionId } = req.params;

try {
  const options = await AnswerOption.findAll({
    where: { questionId },
    order: [['optionIndex', 'ASC']],
  });

  res.json(options);
} catch (err) {
  console.error('Fehler beim Abrufen der Antwortoptionen:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen der Antwortoptionen' });
}
};

// Eine Antwortoption löschen
exports.deleteAnswerOption = async (req, res) => {
const { id } = req.params;

try {
  const deleted = await AnswerOption.destroy({ where: { id } });

  if (!deleted) {
    return res.status(404).json({ error: 'Antwortoption nicht gefunden' });
  }

  res.json({ message: 'Antwortoption gelöscht' });
} catch (err) {
  console.error('Fehler beim Löschen der Antwortoption:', err);
  res.status(500).json({ error: 'Fehler beim Löschen der Antwortoption' });
}
};
