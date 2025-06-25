require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

let testSession;
let testQuestion;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Beispiel-User anlegen
  const user = await User.create({
    username: 'testuser',
    passwordHash: 'hashed'
  });

  // QuizRoom anlegen
  const quizRoom = await QuizRoom.create({
    title: 'Test Raum',
    public: true,
    creatorId: user.id
  });

  // Frage anlegen (mit Pflichtfeldern)
  testQuestion = await Question.create({
    quizRoomId: quizRoom.id,
    questionText: 'Was ist 2 + 2?',
    correctAnswerIndex: 1
  });

  // Quiz-Session anlegen
  testSession = await QuizSession.create({
    userId: user.id,
    started_at: new Date()
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('AnswerInSession API Tests', () => {
  let createdAnswer;

  test('POST /api/answers-in-session - erstellt neue Antwort', async () => {
    const response = await request(app)
      .post('/api/answers-in-session')
      .send({
        quizSessionId: testSession.id,
        questionId: testQuestion.id,
        selectedOptionIndex: 1,
        isCorrect: true,
        answeredAt: new Date().toISOString()
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdAnswer = response.body;
  });

  test('GET /api/answers-in-session/session/:sessionId - gibt Antworten zur Session zurück', async () => {
    const response = await request(app).get(`/api/answers-in-session/session/${testSession.id}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('questionId', testQuestion.id);
  });

  test('DELETE /api/answers-in-session/:id - löscht Antwort', async () => {
    const response = await request(app).delete(`/api/answers-in-session/${createdAnswer.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Antwort gelöscht' });

    // Doppelt löschen (nicht mehr vorhanden)
    const secondTry = await request(app).delete(`/api/answers-in-session/${createdAnswer.id}`);
    expect(secondTry.status).toBe(404);
  });
});