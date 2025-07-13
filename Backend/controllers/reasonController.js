const { Reason } = require('../models');

// Neue Begründung erstellen
exports.createReason = async (req, res) => {
const { questionId, reasonText, reasonIndex } = req.body;

if (!questionId || !reasonText || reasonIndex === undefined) {
  return res.status(400).json({ error: 'questionId, reasonText und reasonIndex sind erforderlich.' });
}

try {
  const reason = await Reason.create({
    questionId,
    reasonText,
    reasonIndex,
  });

  res.status(201).json(reason);
} catch (err) {
  console.error('Fehler beim Erstellen der Begründung:', err);
  res.status(500).json({ error: 'Fehler beim Erstellen der Begründung' });
}
};

// Alle Begründungen zu einer Frage abrufen
exports.getReasonsByQuestion = async (req, res) => {
const { questionId } = req.params;

try {
  const reasons = await Reason.findAll({
    where: { questionId },
    order: [['reasonIndex', 'ASC']]
  });

  res.json(reasons);
} catch (err) {
  console.error('Fehler beim Abrufen der Begründungen:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen der Begründungen' });
}
};

// Begründung löschen
exports.deleteReason = async (req, res) => {
const { id } = req.params;

try {
  const deleted = await Reason.destroy({ where: { id } });

  if (!deleted) {
    return res.status(404).json({ error: 'Begründung nicht gefunden' });
  }

  res.json({ message: 'Begründung gelöscht' });
} catch (err) {
  console.error('Fehler beim Löschen der Begründung:', err);
  res.status(500).json({ error: 'Fehler beim Löschen der Begründung' });
}
};
