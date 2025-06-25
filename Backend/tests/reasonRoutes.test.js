require('dotenv').config();
const { sequelize } = require('../config/database');
const app = require('../app');
const request = require('supertest');
const { Question, QuizRoom, Reason } = require('../models');

let question;
let createdReason;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // QuizRoom + Frage anlegen
  const quizRoom = await QuizRoom.create({ title: 'Begründungs-Test-Raum' });

  question = await Question.create({
    quizRoomId: quizRoom.id,
    questionText: 'Warum ist der Himmel blau?',
    correctAnswerIndex: 1
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Reason API Tests', () => {
  test('POST /api/reasons – erstellt neue Begründung', async () => {
    const response = await request(app)
      .post('/api/reasons')
      .send({
        questionId: question.id,
        reasonText: 'Weil Licht gestreut wird.',
        reasonIndex: 0
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('questionId', question.id);
    expect(response.body).toHaveProperty('reasonText', 'Weil Licht gestreut wird.');
    createdReason = response.body;
  });

  test('GET /api/reasons/question/:questionId – ruft Begründungen zur Frage ab', async () => {
    const response = await request(app).get(`/api/reasons/question/${question.id}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('reasonText');
  });

  test('DELETE /api/reasons/:id – löscht Begründung', async () => {
    const response = await request(app).delete(`/api/reasons/${createdReason.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Begründung gelöscht' });

    // Erneuter Versuch: sollte 404 liefern
    const retry = await request(app).delete(`/api/reasons/${createdReason.id}`);
    expect(retry.status).toBe(404);
  });
});