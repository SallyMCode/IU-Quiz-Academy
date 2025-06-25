require('dotenv').config();
const { sequelize } = require('../config/database');
const app = require('../app');
const request = require('supertest');
const { User, QuizRoom, QuizSession } = require('../models');

let user, quizRoom, session;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Beispiel-Benutzer und Raum erstellen
  user = await User.create({ username: 'testuser', passwordHash: 'secret' });
  quizRoom = await QuizRoom.create({ title: 'Test-Raum' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('QuizSession API Tests', () => {

  test('POST /api/sessions – startet neue Session', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({ userId: user.id, quizRoomId: quizRoom.id });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId', user.id);
    expect(response.body).toHaveProperty('quizRoomId', quizRoom.id);
    expect(response.body).toHaveProperty('state', 'IN_PROGRESS');

    session = response.body; // für spätere Tests merken
  });

  test('GET /api/sessions/:id – ruft einzelne Session ab', async () => {
    const response = await request(app).get(`/api/sessions/${session.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', session.id);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', user.username);
    expect(response.body.quizRoom).toHaveProperty('title', quizRoom.title);
  });

  test('PATCH /api/sessions/:id/end – beendet Session', async () => {
    const response = await request(app).patch(`/api/sessions/${session.id}/end`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Session erfolgreich beendet');
    expect(response.body.session).toHaveProperty('state', 'CLOSED');
    expect(response.body.session).toHaveProperty('endTime');
  });

  test('GET /api/sessions – ruft alle Sessions ab', async () => {
    const response = await request(app).get('/api/sessions');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('user');
    expect(response.body[0]).toHaveProperty('quizRoom');
  });

});
