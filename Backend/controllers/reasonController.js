const { Reason } = require('../models');

// Controller: Neue Begründung für eine Frage erstellen
exports.createReason = async (req, res) => {
  const { questionId, reasonText, reasonIndex } = req.body;

  // Validierung: Frage-ID, Text und Index müssen übergeben werden
  if (!questionId || !reasonText || reasonIndex === undefined) {
    return res.status(400).json({ error: 'questionId, reasonText und reasonIndex sind erforderlich.' });
  }

  try {
    // Begründung in der DB anlegen
    const reason = await Reason.create({
      questionId,
      reasonText,
      reasonIndex,
    });

    // Erfolgreich erstellte Begründung zurückgeben
    res.status(201).json(reason);
  } catch (err) {
    console.error('Fehler beim Erstellen der Begründung:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen der Begründung' });
  }
};

// Controller: Alle Begründungen zu einer bestimmten Frage abrufen
exports.getReasonsByQuestion = async (req, res) => {
  const { questionId } = req.params; // Frage-ID aus URL

  try {
    // Alle Begründungen sortiert nach reasonIndex laden
    const reasons = await Reason.findAll({
      where: { questionId },
      order: [['reasonIndex', 'ASC']]
    });

    res.json(reasons); // Liste der Begründungen zurückgeben
  } catch (err) {
    console.error('Fehler beim Abrufen der Begründungen:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Begründungen' });
  }
};

// Controller: Begründung aktualisieren per ID
exports.updateReason = async (req, res) => {
  const { id } = req.params;
  const { reasonText, reasonIndex } = req.body;

  // Validierung: Mindestens eines der Felder muss übergeben werden
  if (reasonText === undefined && reasonIndex === undefined) {
    return res.status(400).json({ error: 'mindestens reasonText oder reasonIndex muss übergeben werden.' });
  }

  try {
    // Bestehende Begründung suchen
    const reason = await Reason.findByPk(id);

    if (!reason) {
      return res.status(404).json({ error: 'Begründung nicht gefunden' });
    }

    // Felder aktualisieren, falls vorhanden
    if (reasonText !== undefined) reason.reasonText = reasonText;
    if (reasonIndex !== undefined) reason.reasonIndex = reasonIndex;

    await reason.save(); // Änderungen speichern

    res.json(reason); // Aktualisierte Begründung zurückgeben
  } catch (err) {
    console.error('Fehler beim Aktualisieren der Begründung:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Begründung' });
  }
};

// Controller: Begründung löschen per ID
exports.deleteReason = async (req, res) => {
  const { id } = req.params; // Begründungs-ID aus URL

  try {
    // Begründung löschen
    const deleted = await Reason.destroy({ where: { id } });

    // Falls nicht gefunden, 404 zurückgeben
    if (!deleted) {
      return res.status(404).json({ error: 'Begründung nicht gefunden' });
    }

    res.json({ message: 'Begründung gelöscht' }); // Erfolgreiche Löschmeldung
  } catch (err) {
    console.error('Fehler beim Löschen der Begründung:', err);
    res.status(500).json({ error: 'Fehler beim Löschen der Begründung' });
  }
};
