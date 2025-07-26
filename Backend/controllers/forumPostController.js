const { ForumPost, User } = require('../models');

// Funktion zum Abrufen aller Posts eines bestimmten Threads
const getPostsByThread = async (req, res) => {
  try {
    const { threadId } = req.params; // Thread-ID aus der URL-Parameter extrahieren

    // Alle Forum-Posts zum angegebenen Thread abrufen
    // Dabei auch die zugehörigen User-Daten (Autor) mitliefern, aber nur id und username
    const posts = await ForumPost.findAll({
      where: { thread_id: threadId }, // Filterung nach thread_id
      include: [
        {
          model: User,
          as: 'author',             // Alias für die User-Beziehung
          attributes: ['id', 'username'] // Nur ausgewählte Felder zurückgeben
        }
      ],
      order: [['created_at', 'ASC']] // Sortierung nach Erstellungszeit aufsteigend
    });

    res.json(posts); // Ergebnis als JSON zurückgeben
  } catch (error) {
    // Fehlerbehandlung: Fehler protokollieren und 500-Status zurückgeben
    console.error('Fehler beim Laden der ForumPosts:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// Funktion zum Erstellen eines neuen Beitrags im Forum
const createPost = async (req, res) => {
  try {
    const { thread_id, user_id, content } = req.body; // Erwartete Felder aus Anfrage

    // Validierung: Alle Felder müssen vorhanden sein
    if (!thread_id || !user_id || !content) {
      return res.status(400).json({ error: 'thread_id, user_id und content sind erforderlich' });
    }

    // Beitrag in der Datenbank speichern
    const post = await ForumPost.create({
      thread_id,
      user_id,
      content
    });

    // Nach dem Erstellen: Beitrag nochmal abfragen mit User-Daten (für vollständige Antwort)
    const fullPost = await ForumPost.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json(fullPost); // Neu erstellten Beitrag mit Autor-Daten zurückgeben
  } catch (error) {
    // Fehlerbehandlung
    console.error('Fehler beim Erstellen eines ForumPosts:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// Export der beiden Controller-Funktionen, damit sie im Router verwendet werden können
module.exports = {
  getPostsByThread,
  createPost
};
