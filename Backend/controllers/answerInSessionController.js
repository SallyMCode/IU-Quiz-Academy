const { AnswerInSession, Question, QuizSession } = require('../models');

// Alle Antworten einer bestimmten Quiz-Session abrufen
exports.getAnswersBySession = async (req, res) => {
  const { sessionId } = req.params; // Session-ID aus der URL extrahieren

  try {
    const answers = await AnswerInSession.findAll({
      where: { quizSessionId: sessionId }, // Filter nach der gegebenen Session-ID
      include: [
        { model: Question, as: 'question' },       // Frage zur Antwort einbeziehen
        { model: QuizSession, as: 'quizSession' }  // Session-Infos zur Antwort einbeziehen
      ]
    });

    res.json(answers); // Ergebnisse als JSON zurückgeben
  } catch (err) {
    console.error('Fehler beim Abrufen der Antworten:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Antworten' });
  }
};

// Neue Antwort zu einer Quizfrage in einer Session speichern
exports.createAnswer = async (req, res) => {
  const { quizSessionId, questionId, selectedOptionIndex, isCorrect } = req.body;

  // Eingabevalidierung: alle Pflichtfelder müssen vorhanden sein
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
      answeredAt: new Date() // Zeitstempel der Antwort festlegen
    });

    res.status(201).json(answer); // Antwort erfolgreich erstellt
  } catch (err) {
    console.error('Fehler beim Speichern der Antwort:', err);
    res.status(500).json({ error: 'Fehler beim Speichern der Antwort' });
  }
};

// Eine einzelne Antwort per ID löschen
exports.deleteAnswer = async (req, res) => {
  const { id } = req.params; // Antwort-ID aus der URL extrahieren

  try {
    const deleted = await AnswerInSession.destroy({ where: { id } }); // Antwort löschen

    if (!deleted) {
      // Falls keine Antwort mit dieser ID gefunden wurde
      return res.status(404).json({ error: 'Antwort nicht gefunden' });
    }

    res.json({ message: 'Antwort gelöscht' }); // Erfolgsmeldung
  } catch (err) {
    console.error('Fehler beim Löschen der Antwort:', err);
    res.status(500).json({ error: 'Fehler beim Löschen der Antwort' });
  }
};
