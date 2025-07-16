const { ForumThread, User, QuizRoom } = require('../models');

// Alle Threads abrufen (optional nach quiz_room_id filtern)
const getAllThreads = async (req, res) => {
try {
  const { quiz_room_id } = req.query;
  const where = quiz_room_id ? { quiz_room_id } : {};

  const threads = await ForumThread.findAll({
    where,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      },
      {
        model: QuizRoom,
        as: 'quizRoom',
        attributes: ['id', 'title']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  res.json(threads);
} catch (error) {
  console.error('Fehler beim Laden der ForumThreads:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
};

 // Einzelnen Thread abrufen
const getThreadById = async (req, res) => {
try {
  const thread = await ForumThread.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      },
      {
        model: QuizRoom,
        as: 'quizRoom',
        attributes: ['id', 'title']
      }
    ]
  });

  if (!thread) {
    return res.status(404).json({ error: 'Thread nicht gefunden' });
  }

  res.json(thread);
} catch (error) {
  console.error('Fehler beim Laden eines Threads:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
};

// Neuen Thread anlegen
const createThread = async (req, res) => {
try {
  const { title, user_id, quiz_room_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ error: 'title und user_id sind erforderlich' });
  }

  const thread = await ForumThread.create({
    title,
    user_id,
    quiz_room_id: quiz_room_id || null
  });

  res.status(201).json(thread);
} catch (error) {
  console.error('Fehler beim Erstellen eines Threads:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
};

module.exports = {
getAllThreads,
getThreadById,
createThread
};
