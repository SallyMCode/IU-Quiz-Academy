require('dotenv').config();
const request = require('supertest');
const app = require('../app'); 
const { sequelize } = require('../config/database');


beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close(); // Verbindung nach Tests schließen
});

describe('User API Tests', () => {
  test('POST /api/users - erstellt neuen User', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      password: 'testpass123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
  });

  test('POST /api/users - Validierungsfehler', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'x',
      password: '123'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/users/login - Login erfolgreich', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'testpass123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
  });

  test('POST /api/users/login - Login mit falschen Daten', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});