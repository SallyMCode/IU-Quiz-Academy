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
    // Überprüfen, ob bereits eine aktive Session für den Benutzer und den Quizraum existiert
    const existingSession = await QuizSession.findOne({
      where: { userId, quizRoomId, state: 'IN_PROGRESS' }
    });
    if (existingSession) {
      return res.status(200).json(existingSession); // Bestehende Session zurückgeben
    }

    // Neue Session mit aktuellem Zeitstempel und Status "IN_PROGRESS" anlegen
    const now = new Date();
    const newSession = await QuizSession.create({
      userId,
      quizRoomId,
      beginTime: now,
      lastAction: now,         // last_action initial setzen
      state: 'IN_PROGRESS',
      currentQuestion: 0       // current_question initial auf 0 setzen
    });

    return res.status(201).json(newSession); // Erfolgreich erstellte Session zurückgeben
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

exports.updateScore = async (req, res) => {
  const { id } = req.params;
  const { addScore } = req.body;
  try {
    const session = await QuizSession.findByPk(id);
    if (!session) return res.status(404).json({ error: 'Session nicht gefunden' });
    session.score += addScore || 0;
    await session.save();
    res.json({ score: session.score });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Scores' });
  }
};

exports.updateLastAction = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await QuizSession.findByPk(id);
    if (!session) return res.status(404).json({ error: 'Session nicht gefunden' });
    session.lastAction = new Date();
    await session.save();
    res.json({ lastAction: session.lastAction });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren von last_action' });
  }
};

exports.updateCurrentQuestion = async (req, res) => {
  const { id } = req.params;
  const { currentQuestion } = req.body;
  try {
    const session = await QuizSession.findByPk(id);
    if (!session) return res.status(404).json({ error: 'Session nicht gefunden' });
    session.currentQuestion = currentQuestion;
    await session.save();
    res.json({ currentQuestion: session.currentQuestion });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren von current_question' });
  }
};

exports.getUserRoomSessions = async (req, res) => {
  const { userId, quizRoomId } = req.query;
  try {
    const sessions = await QuizSession.findAll({
      where: { userId, quizRoomId }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Sessions für User und QuizRoom' });
  }
};
