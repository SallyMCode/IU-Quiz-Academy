const { QuizSession, User, QuizRoom } = require('../models');

// Controller: Alle Quiz-Sessions abrufen
// Inklusive zugehöriger User- und QuizRoom-Daten (nur ID und Name/Titel)
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await QuizSession.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: QuizRoom, as: 'quizRoom', attributes: ['id', 'title'] }
      ]
    });
    res.json(sessions); // Alle Sessions als JSON senden
  } catch (err) {
    console.error('Fehler beim Abrufen der Sessions:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Sessions' });
  }
};

// Controller: Neue Quiz-Session starten
exports.startSession = async (req, res) => {
  const { userId, quizRoomId } = req.body;

  // Validierung: userId und quizRoomId müssen vorhanden sein
  if (!userId || !quizRoomId) {
    return res.status(400).json({ error: 'userId und quizRoomId sind erforderlich' });
  }

  try {
    // Neue Session mit aktuellem Zeitstempel und Status "IN_PROGRESS" anlegen
    const session = await QuizSession.create({
      userId,
      quizRoomId,
      beginTime: new Date(),
      state: 'IN_PROGRESS'
    });

    res.status(201).json(session); // Erfolgreich erstellte Session zurückgeben
  } catch (err) {
    console.error('Fehler beim Starten der Session:', err);
    res.status(500).json({ error: 'Fehler beim Starten der Session' });
  }
};

// Controller: Einzelne Session per ID abrufen
exports.getSessionById = async (req, res) => {
  const { id } = req.params; // Session-ID aus URL

  try {
    // Session mit zugehörigen User- und QuizRoom-Daten laden
    const session = await QuizSession.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: QuizRoom, as: 'quizRoom', attributes: ['id', 'title'] }
      ]
    });

    // Falls Session nicht gefunden wird 404 zurückgeben
    if (!session) {
      return res.status(404).json({ error: 'Session nicht gefunden' });
    }

    res.json(session); // Gefundene Session als JSON senden
  } catch (err) {
    console.error('Fehler beim Abrufen der Session:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Session' });
  }
};

// Controller: Session beenden
exports.endSession = async (req, res) => {
  const { id } = req.params; // Session-ID aus URL

  try {
    // Session zum Aktualisieren laden
    const session = await QuizSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Session nicht gefunden' });
    }

    // Endzeit und Status aktualisieren
    session.endTime = new Date();
    session.state = 'CLOSED';
    await session.save(); // Änderungen speichern

    // Erfolgsmeldung und aktualisierte Session zurückgeben
    res.json({ message: 'Session erfolgreich beendet', session });
  } catch (err) {
    console.error('Fehler beim Beenden der Session:', err);
    res.status(500).json({ error: 'Fehler beim Beenden der Session' });
  }
};
