// Lädt Umgebungsvariablen aus der .env-Datei
require('dotenv').config();

// Importiert die Express-App und Supertest für HTTP-Anfragen
const app = require('../app'); // Exportierte Express-Instanz
const request = require('supertest');

// Importiert Sequelize-Instanz und Modelle
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

// Vor allen Tests: Datenbank neu synchronisieren (alle Tabellen löschen und neu anlegen)
beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Lege einen Benutzer an, um `creatorId` bei QuizRooms testen zu können
  await User.create({
    username: 'creator1',
    passwordHash: 'dummyhash', // für Auth irrelevant, dient nur der Existenz
  });
});

// Nach allen Tests: Verbindung schließen
afterAll(async () => {
  await sequelize.close();
});

// Test-Suite für die Endpunkte rund um QuizRooms (Fragenräume)
describe('QuizRoom API Tests', () => {

  // Test: Leere Liste abfragen, wenn noch kein Raum erstellt wurde
  test('GET /api/quizrooms - gibt leere Liste zurück', async () => {
    const res = await request(app).get('/api/quizrooms');
    
    // Erwartung: Status 200 und ein leeres Array
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // Test: Einen neuen QuizRoom erfolgreich erstellen
  test('POST /api/quizrooms - erstellt neuen Raum', async () => {
    const creator = await User.findOne({ where: { username: 'creator1' } });

    const res = await request(app)
      .post('/api/quizrooms')
      .send({
        title: 'Mein erster Quizraum',
        public: true,
        creatorId: creator.id, // Verknüpft den Raum mit dem User
      });

    // Erwartung: Raum erfolgreich angelegt, Felder korrekt
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Mein erster Quizraum');
    expect(res.body.public).toBe(true);
    expect(res.body.creatorId).toBe(creator.id);
  });

  // Test: Validierungsfehler beim Versuch, einen zu kurzen Titel zu speichern
  test('POST /api/quizrooms - Validierungsfehler bei kurzem Titel', async () => {
    const res = await request(app)
      .post('/api/quizrooms')
      .send({ title: 'ab' }); // Ungültig laut Modellvalidierung

    // Erwartung: HTTP 400 mit Fehlerbeschreibung
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test: Einzelnen Raum per ID abrufen
  test('GET /api/quizrooms/:id - einzelner Raum', async () => {
    const quizRoom = await QuizRoom.findOne(); // Nimmt ersten gefundenen Raum
    const res = await request(app).get(`/api/quizrooms/${quizRoom.id}`);

    // Erwartung: Korrekte Raumdaten zurückgegeben
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', quizRoom.id);
    expect(res.body.title).toBe(quizRoom.title);
  });

  // Test: Fehlerhafte ID bei Raumabruf (z. B. kein Integer)
  test('GET /api/quizrooms/:id - Fehler bei ungültiger ID', async () => {
    const res = await request(app).get('/api/quizrooms/abc');

    // Erwartung: HTTP 400 mit Validierungsfehler
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test: Einen Raum aktualisieren (PUT)
  test('PUT /api/quizrooms/:id - Raum aktualisieren', async () => {
    const quizRoom = await QuizRoom.findOne();

    const res = await request(app)
      .put(`/api/quizrooms/${quizRoom.id}`)
      .send({ title: 'Aktualisierter Titel', public: false });

    // Erwartung: Raum erfolgreich geändert
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Aktualisierter Titel');
    expect(res.body.public).toBe(false);
  });

  // Test: Einen Raum löschen (DELETE)
  test('DELETE /api/quizrooms/:id - Raum löschen', async () => {
    const quizRoom = await QuizRoom.findOne();

    const res = await request(app).delete(`/api/quizrooms/${quizRoom.id}`);

    // Erwartung: Erfolgreiche Löschbestätigung
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // Test: Fehlermeldung bei ungültiger ID beim Löschen
  test('DELETE /api/quizrooms/:id - Fehler bei ungültiger ID', async () => {
    const res = await request(app).delete('/api/quizrooms/abc');

    // Erwartung: HTTP 400 und Fehlerobjekt
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

});
