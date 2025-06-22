require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Dein Express-App-Export
const { sequelize, User, QuizRoom } = require('../models');

beforeAll(async () => {
  // Tabellen neu erstellen
  await sequelize.sync({ force: true });

  // Optional: einen User anlegen, um creatorId zu testen
  await User.create({
    username: 'creator1',
    passwordHash: 'dummyhash', // nur für Tests relevant
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('QuizRoom API Tests', () => {
  test('GET /api/quizrooms - gibt leere Liste zurück', async () => {
    const res = await request(app).get('/api/quizrooms');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/quizrooms - erstellt neuen Raum', async () => {
    const creator = await User.findOne({ where: { username: 'creator1' } });
    const res = await request(app)
      .post('/api/quizrooms')
      .send({
        title: 'Mein erster Quizraum',
        public: true,
        creatorId: creator.id,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Mein erster Quizraum');
    expect(res.body.public).toBe(true);
    expect(res.body.creatorId).toBe(creator.id);
  });

  test('POST /api/quizrooms - Validierungsfehler bei kurzem Titel', async () => {
    const res = await request(app)
      .post('/api/quizrooms')
      .send({ title: 'ab' }); // zu kurz

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('GET /api/quizrooms/:id - einzelner Raum', async () => {
    const quizRoom = await QuizRoom.findOne();
    const res = await request(app).get(`/api/quizrooms/${quizRoom.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', quizRoom.id);
    expect(res.body.title).toBe(quizRoom.title);
  });

  test('GET /api/quizrooms/:id - Fehler bei ungültiger ID', async () => {
    const res = await request(app).get('/api/quizrooms/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('PUT /api/quizrooms/:id - Raum aktualisieren', async () => {
    const quizRoom = await QuizRoom.findOne();
    const res = await request(app)
      .put(`/api/quizrooms/${quizRoom.id}`)
      .send({ title: 'Aktualisierter Titel', public: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Aktualisierter Titel');
    expect(res.body.public).toBe(false);
  });

  test('DELETE /api/quizrooms/:id - Raum löschen', async () => {
    const quizRoom = await QuizRoom.findOne();
    const res = await request(app).delete(`/api/quizrooms/${quizRoom.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/quizrooms/:id - Fehler bei ungültiger ID', async () => {
    const res = await request(app).delete('/api/quizrooms/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});