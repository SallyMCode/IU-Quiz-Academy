// Lädt Umgebungsvariablen aus der .env-Datei
require('dotenv').config();

// Importiert die Express-App und Supertest für HTTP-Anfragen
const app = require('../app');
const request = require('supertest');

// Importiert die Datenbankverbindung und alle relevanten Sequelize-Modelle
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

// Variablen zur späteren Wiederverwendung
let user, quizRoom, session;

// Wird vor allen Tests einmal ausgeführt
beforeAll(async () => {
  // Setzt die Datenbank vollständig zurück und erstellt alle Tabellen neu
  await sequelize.sync({ force: true });

  // Legt einen Benutzer und einen QuizRoom an, die für die Session-Tests benötigt werden
  user = await User.create({ username: 'testuser', passwordHash: 'secret' }); // Passwort ist hier nur symbolisch gespeichert
  quizRoom = await QuizRoom.create({ title: 'Test-Raum' });
});

// Wird nach allen Tests ausgeführt
afterAll(async () => {
  await sequelize.close(); // Beendet die Verbindung zur Datenbank
});

// Test-Suite für die QuizSession-Endpunkte
describe('QuizSession API Tests', () => {

  // Test: Eine neue Session starten (POST /api/sessions)
  test('POST /api/sessions – startet neue Session', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({ userId: user.id, quizRoomId: quizRoom.id });

    // Erwartung: HTTP 201 und korrekt zurückgegebene Session-Daten
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId', user.id);
    expect(response.body).toHaveProperty('quizRoomId', quizRoom.id);
    expect(response.body).toHaveProperty('state', 'IN_PROGRESS');

    // Speichert die Session für nachfolgende Tests
    session = response.body;
  });

  // Test: Eine einzelne Session per ID abrufen
  test('GET /api/sessions/:id – ruft einzelne Session ab', async () => {
    const response = await request(app).get(`/api/sessions/${session.id}`);

    // Erwartung: HTTP 200 und Rückgabe enthält verknüpften Benutzer und Raum
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', session.id);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', user.username);
    expect(response.body.quizRoom).toHaveProperty('title', quizRoom.title);
  });

  // Test: Session beenden (PATCH /api/sessions/:id/end)
  test('PATCH /api/sessions/:id/end – beendet Session', async () => {
    const response = await request(app).patch(`/api/sessions/${session.id}/end`);

    // Erwartung: HTTP 200 und Session-Zustand auf "CLOSED" geändert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Session erfolgreich beendet');
    expect(response.body.session).toHaveProperty('state', 'CLOSED');
    expect(response.body.session).toHaveProperty('endTime');
  });

  // Test: Alle vorhandenen Sessions abrufen
  test('GET /api/sessions – ruft alle Sessions ab', async () => {
    const response = await request(app).get('/api/sessions');

    // Erwartung: HTTP 200 und Rückgabe eines Arrays mit mindestens einer Session
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('user');       // Inkl. Benutzerdaten
    expect(response.body[0]).toHaveProperty('quizRoom');   // Inkl. Raumdaten
  });

});
