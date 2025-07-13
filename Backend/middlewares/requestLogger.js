const chalk = require('chalk');

const requestLogger = (req, res, next) => {
const timestamp = new Date().toISOString();
const method = chalk.green(req.method);
const path = chalk.blue(req.originalUrl);
const user = req.user ? `User ID: ${req.user.id}` : 'Unauthenticated';

console.log(`[${timestamp}] ${method} ${path} – ${user}`);

next();
};

module.exports = requestLogger;

//  hilft, alle eingehenden HTTP-Anfragen zentral zu überwachen, ohne die Routen- oder Controllerdateien zuzumüllen
// Sie ist eine einfach lesbare, farbige Konsolen-Ausgabe jeder Anfrage – inkl. Pfad, Methode, Zeitpunkt und ggf. User-ID.
