require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const { User, QuizRoom, Question } = require('../models');

let testRoom;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({ username: 'testuser', passwordHash: 'secret' });

  testRoom = await QuizRoom.create({ title: 'Test-Raum', public: true, creatorId: user.id });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Question API Tests (abgestimmt auf Controller)', () => {
  let createdQuestion;

  test('POST /api/questions - erstellt neue Frage', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        quizRoomId: testRoom.id,
        questionText: 'Was ist 2 + 2?',
        correctAnswerIndex: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.questionText).toBe('Was ist 2 + 2?');
    createdQuestion = res.body;
  });

  test('GET /api/questions/room/:quizRoomId - gibt alle Fragen eines Raums zurück', async () => {
    const res = await request(app).get(`/api/questions/room/${testRoom.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].quizRoomId).toBe(testRoom.id);
  });

  test('DELETE /api/questions/:id - löscht die Frage', async () => {
    const res = await request(app).delete(`/api/questions/${createdQuestion.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Frage gelöscht' });

    // Versuch, dieselbe Frage nochmal zu löschen
    const retry = await request(app).delete(`/api/questions/${createdQuestion.id}`);
    expect(retry.status).toBe(404);
    expect(retry.body).toEqual({ error: 'Frage nicht gefunden' });
  });

  test('POST /api/questions - gibt 400 bei fehlenden Feldern', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        // fehlt alles außer correctAnswerIndex
        correctAnswerIndex: 0,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('quizRoomId');
  });
});