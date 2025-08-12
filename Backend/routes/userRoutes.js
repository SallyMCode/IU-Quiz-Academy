const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware zum Authentifizieren von Tokens
const authenticateToken = require('../middlewares/authenticateToken');

// Middleware für Adminrechte
const requireAdmin = require('../middlewares/requireAdmin');

// Helper Middleware für Validierungsergebnisse
const validate = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next();
};

// Alle User abrufen (ggf. mit Authentifizierung schützen)
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

// Neuen User erstellen (Registrierung) mit Validation
router.post(
'/',
[
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username muss zwischen 3 und 50 Zeichen lang sein.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username darf nur Buchstaben, Zahlen und Unterstriche enthalten.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Passwort muss mindestens 6 Zeichen lang sein.'),
  validate,
],
userController.createUser
);

// Login (keine Validierung, da Login z.B. nur username + password erwartet)
router.post(
'/login',
[
  body('username').notEmpty().withMessage('Username ist erforderlich'),
  body('password').notEmpty().withMessage('Passwort ist erforderlich'),
  validate,
],
userController.loginUser
);

// User löschen – nur Admins, mit ID Validierung
router.delete(
'/:id',
[
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('ID muss eine Zahl sein.'),
  validate,
],
userController.deleteUser
);

// Einzelnen User abrufen (öffentliche Route, daher ohne Token-Authentifizierung)
router.get(
  '/:id',
  param('id').isInt().withMessage('ID muss eine Zahl sein.'),
  validate,
  userController.getUserById
);

module.exports = router;

