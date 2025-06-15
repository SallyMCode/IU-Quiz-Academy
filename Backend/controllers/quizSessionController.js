const { QuizSession, User, QuizRoom } = require('../models');

// Alle Sessions abrufen
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await QuizSession.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: QuizRoom, as: 'quizRoom', attributes: ['id', 'title'] }
      ]
    });
    res.json(sessions);
  } catch (err) {
    console.error('Fehler beim Abrufen der Sessions:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Sessions' });
  }
};

// Neue Quiz-Session starten
exports.startSession = async (req, res) => {
  const { userId, quizRoomId } = req.body;

  if (!userId || !quizRoomId) {
    return res.status(400).json({ error: 'userId und quizRoomId sind erforderlich' });
  }

  try {
    const session = await QuizSession.create({
      userId,
      quizRoomId,
      beginTime: new Date(),
      state: 'IN_PROGRESS'
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('Fehler beim Starten der Session:', err);
    res.status(500).json({ error: 'Fehler beim Starten der Session' });
  }
};

// Einzelne Session abrufen
exports.getSessionById = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await QuizSession.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: QuizRoom, as: 'quizRoom', attributes: ['id', 'title'] }
      ]
    });

    if (!session) {
      return res.status(404).json({ error: 'Session nicht gefunden' });
    }

    res.json(session);
  } catch (err) {
    console.error('Fehler beim Abrufen der Session:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Session' });
  }
};

// Session beenden
exports.endSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await QuizSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Session nicht gefunden' });
    }

    session.endTime = new Date();
    session.state = 'CLOSED';
    await session.save();

    res.json({ message: 'Session erfolgreich beendet', session });
  } catch (err) {
    console.error('Fehler beim Beenden der Session:', err);
    res.status(500).json({ error: 'Fehler beim Beenden der Session' });
  }
};
