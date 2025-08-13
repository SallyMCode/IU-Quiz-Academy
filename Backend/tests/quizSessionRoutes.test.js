// Lädt Umgebungsvariablen
require('dotenv').config();

// --- MOCK FÜR AUTHENTIFIZIERUNG ---
// Überspringt die Auth-Middleware während der Tests
jest.mock('../middlewares/authenticateToken', () => (req, res, next) => next());

const request = require('supertest'); // HTTP-Requests an das Backend
const app = require('../app');        // App nach Mock importieren
const { sequelize, QuizSession, QuizRoom, User, Question } = require('../models');

describe('QuizSession API Tests (ohne Auth)', () => {
  let quizRoom;
  let testUser;
  let session;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // DB zurücksetzen

    // Test-User anlegen
    testUser = await User.create({
      username: 'testuser',
      passwordHash: 'testhash',
    });

    // Test-QuizRoom erstellen
    quizRoom = await QuizRoom.create({
      title: 'Test QuizRoom',
      description: 'QuizRoom für Session-Tests',
    });

    // Mindestens eine Frage anlegen
    await Question.create({
      quizRoomId: quizRoom.id,
      questionText: 'Testfrage 1',
      correctAnswerIndex: 0,
    });
  });

  afterAll(async () => {
    await sequelize.close(); // DB-Verbindung schließen
  });

  // ---------------------- TEST: Session erstellen ----------------------
  test('POST /api/quizsessions – startet neue Session', async () => {
    const response = await request(app)
      .post('/api/quizsessions')
      .send({
        userId: testUser.id,
        quizRoomId: quizRoom.id,
        public: true,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body.quizRoomId).toBe(quizRoom.id);

    session = response.body; // Für Folge-Tests speichern
  });

  // ---------------------- TEST: Einzelne Session abrufen ----------------------
  test('GET /api/quizsessions/:id – ruft einzelne Session ab', async () => {
    const response = await request(app)
      .get(`/api/quizsessions/${session.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', session.id);
    expect(response.body.userId).toBe(testUser.id);
  });

  // ---------------------- TEST: Session beenden ----------------------
  test('PATCH /api/quizsessions/:id/end – beendet Session', async () => {
    const response = await request(app)
      .patch(`/api/quizsessions/${session.id}/end`);

    expect(response.status).toBe(200);
    expect(response.body.session.state).toBe('CLOSED');
    expect(response.body.session.endTime).toBeDefined();
  });

  // ---------------------- TEST: Alle Sessions abrufen ----------------------
  test('GET /api/quizsessions – ruft alle Sessions ab', async () => {
    const response = await request(app)
      .get('/api/quizsessions');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('user');
  });
});
