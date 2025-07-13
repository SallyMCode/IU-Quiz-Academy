module.exports = (req, res, next) => {
if (!req.user || !req.user.admin) {
  return res.status(403).json({ error: 'Admin-Rechte erforderlich' });
}
next();
};
