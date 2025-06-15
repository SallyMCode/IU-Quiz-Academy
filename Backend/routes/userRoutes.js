const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Middleware zum Authentifizieren von Tokens
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');

// Alle User abrufen
router.get('/', userController.getAllUsers);

// Neuen User erstellen
router.post('/', userController.createUser);

// Login
router.post('/login', userController.loginUser);

//Middleware
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  // Admin-geschützte Aktion
});

module.exports = router;
