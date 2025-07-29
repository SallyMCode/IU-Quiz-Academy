// Lädt Umgebungsvariablen aus einer .env-Datei, z. B. für Datenbank-URL oder JWT-Secret
require('dotenv').config();

// Supertest wird verwendet, um HTTP-Anfragen gegen unsere Express-App im Test zu simulieren
const request = require('supertest');
const app = require('../app');

// Datenbank-Instanz und Modelle werden importiert
const { sequelize, User, Question, QuizRoom, QuizSession, AnswerInSession, Reason, AnswerOption } = require('../models');

let testQuestion;     // Variable für die Testfrage
let createdOption;    // Hier wird die erstellte Antwortoption gespeichert, um sie später zu testen/löschen

// Wird vor allen Tests ausgeführt: Datenbank zurücksetzen und Testdaten anlegen
beforeAll(async () => {
  // Setzt die Datenbank vollständig zurück (Achtung: löscht alle Daten!)
  await sequelize.sync({ force: true });

  // Es muss ein QuizRoom existieren, da Question einen Foreign Key auf quizRoomId hat
  const room = await QuizRoom.create({ title: 'Dummy Room', public: true });

  // Legt eine neue Frage an, die später mit Antwortoptionen verknüpft wird
  testQuestion = await Question.create({
    quizRoomId: room.id,
    questionText: 'Wie viele Beine hat eine Spinne?',
    correctAnswerIndex: 0,
  });
});

// Wird nach allen Tests ausgeführt: schließt die Datenbankverbindung
afterAll(async () => {
  await sequelize.close();
});

// Testsuite für die API-Routen zu AnswerOption
describe('AnswerOption API Tests', () => {

  // Test für das Erstellen einer Antwortoption per POST
  test('POST /api/answer-options - erstellt neue Antwortoption', async () => {
    const response = await request(app)
      .post('/api/answeroptions')
      .send({
        questionId: testQuestion.id,   // Verknüpfung mit der vorher erstellten Testfrage
        optionIndex: 0,
        optionText: '8',               // Richtige Antwort auf die Spinnenfrage
      });

    // Erwartet wird HTTP-Status 201 (Created)
    expect(response.status).toBe(201);

    // Rückgabe soll eine ID und den übergebenen Text enthalten
    expect(response.body).toHaveProperty('id');
    expect(response.body.optionText).toBe('8');

    // Antwortoption für spätere Tests zwischenspeichern
    createdOption = response.body;
  });

  // Test für das Abrufen aller Antwortoptionen zu einer bestimmten Frage
  test('GET /api/answer-options/question/:questionId - gibt Optionen zur Frage zurück', async () => {
    const response = await request(app).get(`/api/answeroptions/question/${testQuestion.id}`);

    // Erwartet wird HTTP-Status 200 (OK)
    expect(response.status).toBe(200);

    // Die Rückgabe soll ein Array sein
    expect(Array.isArray(response.body)).toBe(true);

    // Die erste Antwortoption soll zur richtigen Frage gehören
    expect(response.body[0]).toHaveProperty('questionId', testQuestion.id);
  });

  // Neuer Test für das Aktualisieren einer Antwortoption per PUT
  test('PUT /api/answer-options/:id - aktualisiert eine Antwortoption', async () => {
    const response = await request(app)
      .put(`/api/answeroptions/${createdOption.id}`)
      .send({
        optionText: 'Acht',      // Aktualisierter Text
        optionIndex: 1,          // Neuer Index
      });

    // Erwartet wird HTTP-Status 200 (OK)
    expect(response.status).toBe(200);

    // Antwort enthält aktualisierte Werte
    expect(response.body).toHaveProperty('id', createdOption.id);
    expect(response.body.optionText).toBe('Acht');
    expect(response.body.optionIndex).toBe(1);
  });

  // Test für das Löschen einer Antwortoption
  test('DELETE /api/answer-options/:id - löscht Antwortoption', async () => {
    const response = await request(app).delete(`/api/answeroptions/${createdOption.id}`);

    // Erwartet wird HTTP-Status 200 und eine Erfolgsmeldung
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Antwortoption gelöscht' });

    // Zusatztest: derselbe Löschversuch nochmal -> sollte 404 zurückgeben
    const secondTry = await request(app).delete(`/api/answeroptions/${createdOption.id}`);
    expect(secondTry.status).toBe(404);
  });
});
