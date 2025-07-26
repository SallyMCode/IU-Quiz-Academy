// Lädt Umgebungsvariablen aus .env-Datei
require('dotenv').config();

// Supertest für HTTP-Requests an Express-App
const request = require('supertest');
const app = require('../app');

// Import der Datenbankverbindung und aller Modelle
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

let testSession;
let testQuestion;

// Setup vor allen Tests: Datenbank zurücksetzen, Beispiel-Daten einfügen
beforeAll(async () => {
  // Synchronisiert alle Tabellen neu (Datenbank wird gelöscht und neu erstellt)
  await sequelize.sync({ force: true });

  // Dummy-Nutzer erstellen (Benötigt z.B. für QuizRoom-Erstellung)
  const user = await User.create({
    username: 'testuser',
    passwordHash: 'hashed' // Hinweis: Nur ein Platzhalter, kein echtes Passwort-Hashing hier
  });

  // Ein öffentlicher QuizRoom wird angelegt, der der Testfrage zugeordnet werden kann
  const quizRoom = await QuizRoom.create({
    title: 'Test Raum',
    public: true,
    creatorId: user.id
  });

  // Beispiel-Frage erstellen, erforderlich für AnswerInSession
  testQuestion = await Question.create({
    quizRoomId: quizRoom.id,
    questionText: 'Was ist 2 + 2?',
    correctAnswerIndex: 1 // Beispiel: Index 1 soll richtig sein
  });

  // Neue QuizSession starten (benötigt für Antwort-Testfälle)
  testSession = await QuizSession.create({
    userId: user.id,
    started_at: new Date()
  });
});

// Cleanup nach allen Tests: Datenbankverbindung schließen
afterAll(async () => {
  await sequelize.close();
});

// Test-Suite für API-Endpunkte rund um "AnswerInSession"
describe('AnswerInSession API Tests', () => {
  let createdAnswer; // Wird im POST-Test gespeichert, um im DELETE-Test verwendet zu werden

  // Test: Eine neue Antwort innerhalb einer Session speichern
  test('POST /api/answers-in-session - erstellt neue Antwort', async () => {
    const response = await request(app)
      .post('/api/answers-in-session')
      .send({
        quizSessionId: testSession.id,
        questionId: testQuestion.id,
        selectedOptionIndex: 1, // Gewählte Antwort-Option
        isCorrect: true,        // Antwort ist korrekt
        answeredAt: new Date().toISOString() // Zeitpunkt der Beantwortung
      });

    expect(response.status).toBe(201); // Erfolg beim Erstellen
    expect(response.body).toHaveProperty('id'); // Antwort hat eine ID erhalten
    createdAnswer = response.body; // Antwort zwischenspeichern für weitere Tests
  });

  // Test: Alle Antworten zu einer bestimmten Session abrufen
  test('GET /api/answers-in-session/session/:sessionId - gibt Antworten zur Session zurück', async () => {
    const response = await request(app).get(`/api/answers-in-session/session/${testSession.id}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Antwort ist ein Array
    expect(response.body[0]).toHaveProperty('questionId', testQuestion.id); // Antwort enthält Fragebezug
  });

  // Test: Antwort löschen und prüfen, ob erfolgreich entfernt wurde
  test('DELETE /api/answers-in-session/:id - löscht Antwort', async () => {
    const response = await request(app).delete(`/api/answers-in-session/${createdAnswer.id}`);
    expect(response.status).toBe(200); // Antwort erfolgreich gelöscht
    expect(response.body).toEqual({ message: 'Antwort gelöscht' });

    // Optionaler Zusatztest: Versuch, dieselbe Antwort erneut zu löschen → sollte 404 ergeben
    const secondTry = await request(app).delete(`/api/answers-in-session/${createdAnswer.id}`);
    expect(secondTry.status).toBe(404);
  });
});
