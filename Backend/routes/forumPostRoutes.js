const express = require('express');
const router = express.Router();
const forumPostController = require('../controllers/forumPostController');

// Alle Posts zu einem Thread
router.get('/:threadId', forumPostController.getPostsByThread);

// Neuen Post erstellen
router.post('/', forumPostController.createPost);

module.exports = router;

// Backend/routes/forumPostRoutes.js; Forumbeiträge-Routen
