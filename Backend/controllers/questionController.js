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

// Controller-Funktion zum Abrufen einer einzelnen Frage per ID
exports.getQuestionByID = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: 'Frage nicht gefunden' });
    }
    res.json(question);
  } catch (err) {
    console.error('Fehler beim Abrufen der Frage:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Frage' });
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

// Controller-Funktion zum Aktualisieren einer Frage anhand ihrer ID
exports.updateQuestion = async (req, res) => {
  const { id } = req.params; // ID der zu aktualisierenden Frage
  const { questionText, correctAnswerIndex, quizRoomId } = req.body; // Neue Werte aus dem Body

  try {
    // Die Frage anhand der ID finden
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Frage nicht gefunden' });
    }

    // Nur die Felder aktualisieren, die im Body enthalten sind
    if (questionText !== undefined) {
      question.questionText = questionText;
    }
    if (correctAnswerIndex !== undefined) {
      question.correctAnswerIndex = correctAnswerIndex;
    }
    if (quizRoomId !== undefined) {
      question.quizRoomId = quizRoomId;
    }

    // Speichern der Änderungen
    await question.save();

    // Erfolgreiche Antwort mit aktualisierter Frage
    res.json(question);
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Aktualisieren der Frage:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Frage' });
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
