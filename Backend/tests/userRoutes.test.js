// Lädt Umgebungsvariablen aus der .env-Datei
require('dotenv').config();

// Importiert die Express-App und Supertest für HTTP-Anfragen
const app = require('../app'); 
const request = require('supertest');

// Importiert die Datenbankverbindung und alle Modelle
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

// Führt vor allen Tests ein vollständiges Zurücksetzen und Neuanlegen der Datenbank durch
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Achtung: löscht alle Daten! Auf keinen Fall in der Produktion verwenden! -> löschte alle Daten der Datenkbank
});

// Schließt die Datenbankverbindung nach allen Tests
afterAll(async () => {
  await sequelize.close();
});

// Test-Suite für die User-bezogenen API-Endpunkte
describe('User API Tests', () => {

  // Test: Ein neuer User kann erfolgreich registriert werden
  test('POST /api/users - erstellt neuen User', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      password: 'testpass123'
    });

    // Erwartung: Erfolgreiche Erstellung (HTTP 201), Rückgabe enthält Benutzer-ID und richtigen Benutzernamen
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
  });

  // Test: Registrierung mit ungültigen Eingaben (z. B. zu kurzer Name oder Passwort)
  test('POST /api/users - Validierungsfehler', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'x', // zu kurz
      password: '123' // ebenfalls zu kurz
    });

    // Erwartung: Server gibt HTTP 400 mit Validierungsfehlern zurück
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test: Erfolgreicher Login mit korrekten Zugangsdaten
  test('POST /api/users/login - Login erfolgreich', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'testpass123'
    });

    // Erwartung: HTTP 200 und Rückgabe des Benutzers
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
  });

  // Test: Fehlgeschlagener Login mit falschem Passwort
  test('POST /api/users/login - Login mit falschen Daten', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'wrongpass' // falsches Passwort
    });

    // Erwartung: HTTP 401 (unauthorized) und eine Fehlernachricht
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

});
