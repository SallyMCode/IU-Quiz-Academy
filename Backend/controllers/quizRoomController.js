const { QuizRoom, User } = require('../models');

// Controller-Funktion: Alle Quiz-Räume abrufen
// Inklusive des Erstellers (creator) mit ID und Username
exports.getAllQuizRooms = async (req, res) => {
  try {
    const rooms = await QuizRoom.findAll({
      include: {
        model: User,
        as: 'creator', // Alias für die Beziehung
        attributes: ['id', 'username'] // Nur ausgewählte Felder abrufen
      }
    });
    res.json(rooms); // Ergebnis als JSON zurückgeben
  } catch (err) {
    console.error('Fehler beim Abrufen der Quiz-Räume:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quiz-Räume' });
  }
};

// Controller-Funktion: Neuen Quiz-Raum erstellen
exports.createQuizRoom = async (req, res) => {
  const { title, creatorId } = req.body; // title und creatorId aus Body
  const isPublic = req.body.public;      // public-Flag aus Body

  // Validierung: title muss vorhanden sein
  if (!title) {
    return res.status(400).json({ error: 'Titel des Quiz-Raums ist erforderlich.' });
  }

  try {
    // Neuen Raum mit angegebenen Daten erstellen
    const room = await QuizRoom.create({
      title,
      public: !!isPublic,         // Boolean-Konvertierung (true/false)
      creatorId: creatorId || null // creatorId optional, sonst null
    });
    res.status(201).json(room);   // Erfolgreiche Erstellung mit Status 201
  } catch (err) {
    console.error('Fehler beim Erstellen des Quiz-Raums:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des Quiz-Raums' });
  }
};

// Controller-Funktion: Einzelnen Quiz-Raum per ID abrufen
exports.getQuizRoomById = async (req, res) => {
  const { id } = req.params; // ID aus URL-Parameter

  try {
    const room = await QuizRoom.findByPk(id, {
      include: {
        model: User,
        as: 'creator', // Beziehung zum Ersteller
        attributes: ['id', 'username']
      }
    });

    // Falls Raum nicht gefunden wird 404 zurückgeben
    if (!room) {
      return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
    }

    res.json(room); // Raum als JSON zurückgeben
  } catch (err) {
    console.error('Fehler beim Abrufen des Quiz-Raums:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen des Quiz-Raums' });
  }
};

// Controller-Funktion: Quiz-Raum löschen
exports.deleteQuizRoom = async (req, res) => {
  const { id } = req.params; // ID aus URL

  try {
    // Versuche, Raum mit der ID zu löschen
    const rowsDeleted = await QuizRoom.destroy({ where: { id } });

    // Falls kein Raum gelöscht wurde, 404 zurückgeben
    if (!rowsDeleted) {
      return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
    }

    res.json({ message: 'Quiz-Raum gelöscht' }); // Erfolgsmeldung
  } catch (err) {
    console.error('Fehler beim Löschen des Quiz-Raums:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Quiz-Raums' });
  }
};

// Controller-Funktion: Quiz-Raum aktualisieren
exports.updateQuizRoom = async (req, res) => {
  const { id } = req.params; // ID aus URL
  const { title, creatorId } = req.body; // Felder aus Body
  const isPublic = req.body.public; // public-Flag aus Body

  try {
    // Raum mit gegebener ID abrufen
    const room = await QuizRoom.findByPk(id);

    // Falls nicht gefunden, 404 zurückgeben
    if (!room) {
      return res.status(404).json({ error: 'Quiz-Raum nicht gefunden' });
    }

    // Nur übergebene Felder aktualisieren
    if (title !== undefined) room.title = title;
    if (isPublic !== undefined) room.public = isPublic;
    if (creatorId !== undefined) room.creatorId = creatorId;

    await room.save(); // Änderungen speichern

    res.json(room); // Aktualisierten Raum zurückgeben
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Quiz-Raums:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Quiz-Raums' });
  }
};
