const app = require('./app');
const { testConnection, sequelize } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  const isConnected = await testConnection();
  if (isConnected) {
    try {
      await sequelize.sync({ alter: true });
      console.log('Datenbank verbunden & synchronisiert.');

      app.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Fehler beim Start:', err);
    }
  } else {
    console.error('DB-Verbindung fehlgeschlagen. Server wird nicht gestartet.');
  }
}

startServer();
