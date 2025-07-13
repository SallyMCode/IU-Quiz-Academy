const { QuizRoom, User } = require('../models');

// Alle Quiz-Räume abrufen (inkl. Ersteller-Name)
exports.getAllQuizRooms = async (req, res) => {
try {
  const rooms = await QuizRoom.findAll({
    include: {
      model: User,
      as: 'creator',
      attributes: ['id', 'username']
    }
  });
  res.json(rooms);
} catch (err) {
  console.error('Fehler beim Abrufen der Quiz-Räume:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen der Quiz-Räume' });
}
};

// Neuen Quiz-Raum erstellen
exports.createQuizRoom = async (req, res) => {
const { title, creatorId } = req.body;
const isPublic = req.body.public;

if (!title) {
  return res.status(400).json({ error: 'Titel des Quiz-Raums ist erforderlich.' });
}

try {
  const room = await QuizRoom.create({
    title,
    public: !!isPublic,
    creatorId: creatorId || null
  });
  res.status(201).json(room);
} catch (err) {
  console.error('Fehler beim Erstellen des Quiz-Raums:', err);
  res.status(500).json({ error: 'Fehler beim Erstellen des Quiz-Raums' });
}
};

// Einzelnen Quiz-Raum abrufen
exports.getQuizRoomById = async (req, res) => {
const { id } = req.params;

try {
  const room = await QuizRoom.findByPk(id, {
    include: {
      model: User,
      as: 'creator',
      attributes: ['id', 'username']
    }
  });

  if (!room) {
    return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
  }

  res.json(room);
} catch (err) {
  console.error('Fehler beim Abrufen des Quiz-Raums:', err);
  res.status(500).json({ error: 'Fehler beim Abrufen des Quiz-Raums' });
}
};

// Quiz-Raum löschen
exports.deleteQuizRoom = async (req, res) => {
const { id } = req.params;

try {
  const rowsDeleted = await QuizRoom.destroy({ where: { id } });

  if (!rowsDeleted) {
    return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
  }

  res.json({ message: 'Quiz-Raum gelöscht' });
} catch (err) {
  console.error('Fehler beim Löschen des Quiz-Raums:', err);
  res.status(500).json({ error: 'Fehler beim Löschen des Quiz-Raums' });
}
};

// Quiz-Raum aktualisieren
exports.updateQuizRoom = async (req, res) => {
const { id } = req.params;
const { title, creatorId } = req.body;
const isPublic = req.body.public;

try {
  const room = await QuizRoom.findByPk(id);

  if (!room) {
    return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
  }

  // Nur Felder aktualisieren, die auch übergeben wurden
  if (title !== undefined) room.title = title;
  if (isPublic !== undefined) room.public = isPublic;
  if (creatorId !== undefined) room.creatorId = creatorId;

  await room.save();

  res.json(room);
} catch (err) {
  console.error('Fehler beim Aktualisieren des Quiz-Raums:', err);
  res.status(500).json({ error: 'Fehler beim Aktualisieren des Quiz-Raums' });
}
};