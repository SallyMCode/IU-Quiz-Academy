const { ForumThread, User, QuizRoom } = require('../models');

// Funktion zum Abrufen aller Forum-Threads
// Optional kann nach quiz_room_id gefiltert werden (Query-Parameter)
const getAllThreads = async (req, res) => {
  try {
    const { quiz_room_id } = req.query; // quiz_room_id optional aus Query-Parameter auslesen
    const where = quiz_room_id ? { quiz_room_id } : {}; // Filter setzen, falls vorhanden

    // Threads aus DB laden, inkl. Autor und QuizRoom (nur bestimmte Felder)
    const threads = await ForumThread.findAll({
      where,
      include: [
        {
          model: User,
          as: 'author',            // Alias für Beziehung zu User (Autor)
          attributes: ['id', 'username'] // Nur id und username zurückgeben
        },
        {
          model: QuizRoom,
          as: 'quizRoom',          // Alias für Beziehung zum QuizRoom
          attributes: ['id', 'title']     // Nur id und Titel zurückgeben
        }
      ],
      order: [['created_at', 'DESC']] // Sortiert nach Erstellungsdatum, neueste zuerst
    });

    res.json(threads); // Ergebnis als JSON zurückgeben
  } catch (error) {
    // Fehlerbehandlung: Fehler loggen und 500 zurückgeben
    console.error('Fehler beim Laden der ForumThreads:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// Funktion zum Abrufen eines einzelnen Threads anhand der ID
const getThreadById = async (req, res) => {
  try {
    // Thread mit Primärschlüssel (ID) suchen inkl. Autor und QuizRoom
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
      // Falls kein Thread mit der ID gefunden wurde, 404 zurückgeben
      return res.status(404).json({ error: 'Thread nicht gefunden' });
    }

    res.json(thread); // Gefundenen Thread als JSON zurückgeben
  } catch (error) {
    console.error('Fehler beim Laden eines Threads:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// Funktion zum Anlegen eines neuen Forum-Threads
const createThread = async (req, res) => {
  try {
    const { title, user_id, quiz_room_id } = req.body; // Erwartete Felder aus dem Body

    // Validierung: title und user_id sind Pflichtfelder
    if (!title || !user_id) {
      return res.status(400).json({ error: 'title und user_id sind erforderlich' });
    }

    // Neuen Thread in der DB anlegen; quiz_room_id ist optional
    const thread = await ForumThread.create({
      title,
      user_id,
      quiz_room_id: quiz_room_id || null
    });

    res.status(201).json(thread); // Erfolgreiche Erstellung zurückgeben
  } catch (error) {
    console.error('Fehler beim Erstellen eines Threads:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// Export der Controller-Funktionen für die Verwendung im Routing
module.exports = {
  getAllThreads,
  getThreadById,
  createThread
};
