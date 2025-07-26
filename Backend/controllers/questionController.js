const { Question } = require('../models');

// Controller-Funktion zum Erstellen einer neuen Frage
exports.createQuestion = async (req, res) => {
  // Extrahiert benötigte Daten aus dem Request-Body
  const { quizRoomId, questionText, correctAnswerIndex } = req.body;

  // Validierung: Alle drei Felder müssen vorhanden sein
  if (!quizRoomId || !questionText || correctAnswerIndex === undefined) {
    return res.status(400).json({
      error: 'quizRoomId, questionText und correctAnswerIndex sind erforderlich.',
    });
  }

  try {
    // Erstellt einen neuen Eintrag in der Question-Tabelle
    const question = await Question.create({
      quizRoomId,
      questionText,
      correctAnswerIndex,
    });

    // Erfolgreiche Antwort mit Status 201 und der neu erstellten Frage
    res.status(201).json(question);
  } catch (err) {
    // Fehlerbehandlung: Fehler in der Konsole ausgeben und 500 zurückgeben
    console.error('Fehler beim Erstellen der Frage:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen der Frage' });
  }
};

// Controller-Funktion zum Abrufen aller Fragen eines bestimmten QuizRaums
exports.getQuestionsByRoom = async (req, res) => {
  const { quizRoomId } = req.params; // QuizRoom-ID aus URL-Parameter auslesen

  try {
    // Alle Fragen zum QuizRoom in aufsteigender Reihenfolge nach ID abrufen
    const questions = await Question.findAll({
      where: { quizRoomId },
      order: [['id', 'ASC']],
    });

    // Ergebnis als JSON zurückgeben
    res.json(questions);
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Abrufen der Fragen:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Fragen' });
  }
};

// Controller-Funktion zum Löschen einer Frage anhand ihrer ID
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params; // ID aus URL-Parameter

  try {
    // Versuch, die Frage mit gegebener ID zu löschen
    const deleted = await Question.destroy({ where: { id } });

    if (!deleted) {
      // Falls keine Frage gelöscht wurde, 404 zurückgeben
      return res.status(404).json({ error: 'Frage nicht gefunden' });
    }

    // Erfolgsmeldung bei erfolgreichem Löschen
    res.json({ message: 'Frage gelöscht' });
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Löschen der Frage:', err);
    res.status(500).json({ error: 'Fehler beim Löschen der Frage' });
  }
};
