const express = require('express');
const router = express.Router();
const forumThreadsController = require('../controllers/forumThreadsController');

router.get('/', forumThreadsController.getAllThreads);
router.get('/:id', forumThreadsController.getThreadById);
router.post('/', forumThreadsController.createThread);

module.exports = router;

// Backend/routes/forumThreadsRoutes.js; Forumthemen-Routen
