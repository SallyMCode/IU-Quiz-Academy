const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"


if (!token) return res.sendStatus(401);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) return res.sendStatus(403);

  req.user = user;
  next();
} catch (err) {
  return res.status(403).json({ error: 'Ungültiger Token' });
}
};


// Es werden ausschließlich authentifizierte Anfragen weiterverarbeitet. Das JWT wird aus dem Header gelesen und validiert. Der dazugehörige 
//Benutzer wird aus der Datenbank geladen und in `req.user` gespeichert. Falls der Token ungültig ist oder der Benutzer nicht existiert, wird ein Fehler zurückgegeben.