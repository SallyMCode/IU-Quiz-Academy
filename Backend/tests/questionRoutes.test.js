// Lädt Umgebungsvariablen (z. B. für DB-Zugriff oder JWT) aus .env-Datei
require('dotenv').config();

// Importiert Express-App und Supertest für HTTP-Tests
const request = require('supertest');
const app = require('../app');

// Importiert die Sequelize-Instanz und alle Modelle
const { sequelize, User, Question, QuizRoom } = require('../models');

let testRoom; // Referenz auf einen angelegten Raum, der für die Tests verwendet wird
let createdUser; // Erstellt einen Benutzer global, um ID wiederzuverwenden
let createdQuestion; // Speichert erstellte Frage für spätere Tests

// Wird einmal vor allen Tests ausgeführt
beforeAll(async () => {
  // Setzt Datenbank zurück (alle Tabellen leeren und neu anlegen)
  await sequelize.sync({ force: true });

  // Erstellt einen Benutzer, um einen QuizRoom anzulegen
  createdUser = await User.create({ username: 'testuser', passwordHash: 'secret' });

  // Erstellt einen QuizRoom (Fragenraum), in dem später Fragen angelegt werden
  testRoom = await QuizRoom.create({ title: 'Test-Raum', public: true, creatorId: createdUser.id });
});

// Wird nach allen Tests ausgeführt
afterAll(async () => {
  await sequelize.close(); // DB-Verbindung schließen
});

// Test-Suite für die API-Endpunkte zum Verwalten von Fragen
describe('Question API Tests (abgestimmt auf Controller)', () => {

  // Test: Neue Frage erfolgreich anlegen
  test('POST /api/questions - erstellt neue Frage', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        quizRoomId: testRoom.id,         // Raum, dem die Frage zugeordnet ist
        questionText: 'Was ist 2 + 2?',  // Fragetext
        correctAnswerIndex: 1            // Index der richtigen Antwort (z. B. 1 = B)
      });

    // Erwartung: Frage wurde erfolgreich erstellt
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.questionText).toBe('Was ist 2 + 2?');

    // Speichert die Frage für spätere Tests (z. B. Aktualisieren oder Löschen)
    createdQuestion = res.body;
  });

  // Test: Alle Fragen eines Raums abrufen
  test('GET /api/questions/room/:quizRoomId - gibt alle Fragen eines Raums zurück', async () => {
    const res = await request(app).get(`/api/questions/room/${testRoom.id}`);

    // Erwartung: Status 200, Ergebnis ist ein Array mit mindestens einer Frage
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].quizRoomId).toBe(testRoom.id);
  });

  // Test: PUT /api/questions/:id - aktualisiert eine bestehende Frage
  test('PUT /api/questions/:id - aktualisiert die Frage erfolgreich', async () => {
    const res = await request(app)
      .put(`/api/questions/${createdQuestion.id}`)
      .send({
        questionText: 'Wie viel ist 3 + 3?',
        correctAnswerIndex: 0
      });

    // Erwartung: Erfolgreiche Aktualisierung
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('id', createdQuestion.id);
expect(res.body.questionText).toBe('Wie viel ist 3 + 3?');
expect(res.body.correctAnswerIndex).toBe(0);

    // Überprüft, ob die Frage aktualisiert wurde
    const check = await request(app).get(`/api/questions/${createdQuestion.id}`);
    expect(check.status).toBe(200);
    expect(check.body.questionText).toBe('Wie viel ist 3 + 3?');
    expect(check.body.correctAnswerIndex).toBe(0);
  });

  // Test: Frage löschen
  test('DELETE /api/questions/:id - löscht die Frage', async () => {
    const res = await request(app).delete(`/api/questions/${createdQuestion.id}`);

    // Erwartung: Erfolgreiche Löschmeldung
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Frage gelöscht' });

    // Test: Erneuter Löschversuch sollte fehlschlagen
    const retry = await request(app).delete(`/api/questions/${createdQuestion.id}`);
    expect(retry.status).toBe(404);
    expect(retry.body).toEqual({ error: 'Frage nicht gefunden' });
  });

  // Test: Fehlerhafte Anfrage – fehlende Pflichtfelder
  test('POST /api/questions - gibt 400 bei fehlenden Feldern', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        correctAnswerIndex: 0 // Fehlende Felder: quizRoomId, questionText
      });

    // Erwartung: HTTP 400 und Liste von Validierungsfehlern
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);

    const errorMsgs = res.body.errors.map(err => err.msg);

    // Erwartung: Zwei bestimmte Fehlermeldungen enthalten
    expect(errorMsgs).toContain('quizRoomId muss eine positive Zahl sein.');
    expect(errorMsgs).toContain('Fragetext muss mindestens 5 Zeichen lang sein.');
  });
});
