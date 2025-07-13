const { ForumPost, User } = require('../models');

// Alle Posts eines Threads abrufen
const getPostsByThread = async (req, res) => {
try {
  const { threadId } = req.params;

  const posts = await ForumPost.findAll({
    where: { thread_id: threadId },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }
    ],
    order: [['created_at', 'ASC']]
  });

  res.json(posts);
} catch (error) {
  console.error('Fehler beim Laden der ForumPosts:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
};

// Neuen Beitrag erstellen
const createPost = async (req, res) => {
try {
  const { thread_id, user_id, content } = req.body;

  if (!thread_id || !user_id || !content) {
    return res.status(400).json({ error: 'thread_id, user_id und content sind erforderlich' });
  }

  // Beitrag anlegen
  const post = await ForumPost.create({
    thread_id,
    user_id,
    content
  });

  // Direkt danach erneut abrufen mit User-Daten
  const fullPost = await ForumPost.findByPk(post.id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }
    ]
  });

  res.status(201).json(fullPost);
} catch (error) {
  console.error('Fehler beim Erstellen eines ForumPosts:', error);
  res.status(500).json({ error: 'Interner Serverfehler' });
}
};

module.exports = {
getPostsByThread,
createPost
};
