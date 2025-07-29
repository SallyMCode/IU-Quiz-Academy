const { AnswerOption } = require('../models');

// Controller-Funktion zum Erstellen einer neuen Antwortoption
exports.createAnswerOption = async (req, res) => {
  // Erwartete Felder aus dem Request-Body auslesen
  const { questionId, optionIndex, optionText } = req.body;

  // Validierung: Prüfen, ob alle Pflichtfelder vorhanden sind
  if (!questionId || optionIndex === undefined || !optionText) {
    return res.status(400).json({
      error: 'questionId, optionIndex und optionText sind erforderlich.',
    });
  }

  try {
    // Antwortoption in der Datenbank anlegen
    const option = await AnswerOption.create({
      questionId,
      optionIndex,
      optionText,
    });

    // Erfolgreiche Erstellung: Antwortoption als JSON zurückgeben (HTTP 201)
    res.status(201).json(option);
  } catch (err) {
    // Fehlerbehandlung: Fehler in der Konsole ausgeben und 500 zurückgeben
    console.error('Fehler beim Erstellen der Antwortoption:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen der Antwortoption' });
  }
};

// Controller-Funktion zum Abrufen aller Antwortoptionen einer bestimmten Frage
exports.getOptionsByQuestion = async (req, res) => {
  const { questionId } = req.params; // Frage-ID aus der URL auslesen

  try {
    // Alle Antwortoptionen mit passender Frage-ID abrufen, sortiert nach optionIndex aufsteigend
    const options = await AnswerOption.findAll({
      where: { questionId },
      order: [['optionIndex', 'ASC']],
    });

    // Antwortoptionen als JSON zurückgeben
    res.json(options);
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Abrufen der Antwortoptionen:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Antwortoptionen' });
  }
};

// Controller-Funktion zum Löschen einer Antwortoption anhand der ID
exports.deleteAnswerOption = async (req, res) => {
  const { id } = req.params; // Antwortoption-ID aus der URL auslesen

  try {
    // Versuche, die Antwortoption mit der gegebenen ID zu löschen
    const deleted = await AnswerOption.destroy({ where: { id } });

    if (!deleted) {
      // Falls keine Antwortoption gefunden wurde, 404 zurückgeben
      return res.status(404).json({ error: 'Antwortoption nicht gefunden' });
    }

    // Erfolgreiches Löschen: Bestätigung zurückgeben
    res.json({ message: 'Antwortoption gelöscht' });
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Löschen der Antwortoption:', err);
    res.status(500).json({ error: 'Fehler beim Löschen der Antwortoption' });
  }
};

// Neue Controller-Funktion zum Aktualisieren einer Antwortoption anhand der ID
exports.updateAnswerOption = async (req, res) => {
  const { id } = req.params; // ID der zu aktualisierenden Antwortoption
  const { questionId, optionIndex, optionText } = req.body; // Mögliche neue Werte

  try {
    // Antwortoption anhand der ID suchen
    const option = await AnswerOption.findByPk(id);

    if (!option) {
      // Wenn nicht gefunden, 404 zurückgeben
      return res.status(404).json({ error: 'Antwortoption nicht gefunden' });
    }

    // Nur Felder aktualisieren, die im Body mitgegeben wurden
    if (questionId !== undefined) option.questionId = questionId;
    if (optionIndex !== undefined) option.optionIndex = optionIndex;
    if (optionText !== undefined) option.optionText = optionText;

    // Änderungen speichern
    await option.save();

    // Erfolgreiche Antwort mit aktualisierter Antwortoption zurückgeben
    res.json(option);
  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler beim Aktualisieren der Antwortoption:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Antwortoption' });
  }
};
