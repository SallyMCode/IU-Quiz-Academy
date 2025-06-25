require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

let testQuestion;
let createdOption;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Dummy QuizRoom, weil Question quizRoomId braucht
  const room = await QuizRoom.create({ title: 'Dummy Room', public: true });

  // Testfrage anlegen
  testQuestion = await Question.create({
    quizRoomId: room.id,
    questionText: 'Wie viele Beine hat eine Spinne?',
    correctAnswerIndex: 0,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('AnswerOption API Tests', () => {
  test('POST /api/answer-options - erstellt neue Antwortoption', async () => {
    const response = await request(app)
      .post('/api/answer-options')
      .send({
        questionId: testQuestion.id,
        optionIndex: 0,
        optionText: '8',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.optionText).toBe('8');
    createdOption = response.body;
  });

  test('GET /api/answer-options/question/:questionId - gibt Optionen zur Frage zurück', async () => {
    const response = await request(app).get(`/api/answer-options/question/${testQuestion.id}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('questionId', testQuestion.id);
  });

  test('DELETE /api/answer-options/:id - löscht Antwortoption', async () => {
    const response = await request(app).delete(`/api/answer-options/${createdOption.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Antwortoption gelöscht' });

    // Optional: nochmal löschen = 404
    const secondTry = await request(app).delete(`/api/answer-options/${createdOption.id}`);
    expect(secondTry.status).toBe(404);
  });
});
