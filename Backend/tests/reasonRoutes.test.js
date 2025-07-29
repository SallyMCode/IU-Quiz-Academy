// Lädt Umgebungsvariablen aus der .env-Datei
require('dotenv').config();

// Importiert Express-App und Supertest für das Testen der HTTP-Endpunkte
const app = require('../app');
const request = require('supertest');

// Importiert die Datenbankinstanz und relevante Modelle
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

let question;       // Wird global gespeichert, um in mehreren Tests verwendet zu werden
let createdReason;  // Hier speichern wir eine erstellte Begründung für spätere Tests

// Wird einmal vor allen Tests ausgeführt
beforeAll(async () => {
  // Setzt die Datenbank zurück und erstellt Tabellen neu
  await sequelize.sync({ force: true });

  // Erstellt einen QuizRoom (Fragenraum) zur Zuordnung von Fragen
  const quizRoom = await QuizRoom.create({ title: 'Begründungs-Test-Raum' });

  // Erstellt eine Beispiel-Frage in diesem Raum
  question = await Question.create({
    quizRoomId: quizRoom.id,
    questionText: 'Warum ist der Himmel blau?',
    correctAnswerIndex: 1
  });
});

// Wird einmal nach allen Tests ausgeführt
afterAll(async () => {
  await sequelize.close(); // Beendet die DB-Verbindung
});

// Test-Suite für Reason-Endpunkte (Begründungen)
describe('Reason API Tests', () => {

  // Test: Neue Begründung für eine Frage wird erfolgreich erstellt
  test('POST /api/reasons – erstellt neue Begründung', async () => {
    const response = await request(app)
      .post('/api/reasons')
      .send({
        questionId: question.id,              // Zuordnung zur vorher angelegten Frage
        reasonText: 'Weil Licht gestreut wird.', // Begründungstext
        reasonIndex: 0                         // Index für diese Begründung
      });

    // Erwartung: HTTP 201, Rückgabe enthält ID, questionId und reasonText
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('questionId', question.id);
    expect(response.body).toHaveProperty('reasonText', 'Weil Licht gestreut wird.');

    // Speichern für nachfolgende Tests
    createdReason = response.body;
  });

  // Test: Alle Begründungen zu einer bestimmten Frage abrufen
  test('GET /api/reasons/question/:questionId – ruft Begründungen zur Frage ab', async () => {
    const response = await request(app).get(`/api/reasons/question/${question.id}`);

    // Erwartung: HTTP 200, Rückgabe ist ein Array mit mindestens einer Begründung
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('reasonText');
  });

  // Test: Begründung aktualisieren
  test('PUT /api/reasons/:id – aktualisiert eine bestehende Begründung', async () => {
    const response = await request(app)
      .put(`/api/reasons/${createdReason.id}`)
      .send({
        reasonText: 'Weil Sonnenlicht an Luftmolekülen gestreut wird.',
        reasonIndex: 1
      });

    // Erwartung: HTTP 200, Rückgabe enthält aktualisierte Felder
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdReason.id);
    expect(response.body).toHaveProperty('reasonText', 'Weil Sonnenlicht an Luftmolekülen gestreut wird.');
    expect(response.body).toHaveProperty('reasonIndex', 1);
  });

  // Test: Begründung löschen und prüfen, dass sie nicht erneut gelöscht werden kann
  test('DELETE /api/reasons/:id – löscht Begründung', async () => {
    const response = await request(app).delete(`/api/reasons/${createdReason.id}`);

    // Erwartung: HTTP 200 mit Bestätigung
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Begründung gelöscht' });

    // Wiederholter Löschversuch – sollte nun 404 liefern
    const retry = await request(app).delete(`/api/reasons/${createdReason.id}`);
    expect(retry.status).toBe(404);
  });

});
