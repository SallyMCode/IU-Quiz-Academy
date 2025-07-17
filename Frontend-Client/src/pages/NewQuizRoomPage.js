import React, { useState, useEffect } from 'react';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import ButtonGroup from '../assets/components/ButtonGroup';
import './NewQuizRoomPage.css'; 

// Eine Hilfsfunktion zum Generieren einer eindeutigen ID
// Für den Prod-Einsatz würde das Backend IDs vergeben
const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

function NewQuizRoomPage() {
  // State für den Quizraum-Titel und ob er bereits gespeichert wurde
  const [quizRoomTitle, setQuizRoomTitle] = useState('');
  const [quizRoomSaved, setQuizRoomSaved] = useState(false);
  const [quizRoomId, setQuizRoomId] = useState(null); // Speichert die ID des Quizraums nach dem Speichern

  // State für die aktuell eingegebene Frage
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    answers: ['', '', '', ''], // Array für Antwort 1 bis 4
    correctAnswerIndex: '0', // Standardmäßig Antwort 1
  });

  // State für die Liste aller Fragen, die diesem Quizraum hinzugefügt wurden
  // Struktur: [{ id: 'q1', questionText: '...', answers: [...], correctAnswerIndex: '...' }]
  const [questions, setQuestions] = useState([]);

  // Handler für Änderungen in den Input-Feldern der Frage
  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };

  // Handler für Änderungen in den Antwort-Input-Feldern
  const handleAnswerInputChange = (index, value) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = value;
    setCurrentQuestion(prev => ({ ...prev, answers: newAnswers }));
  };

  // Handler für die Auswahl der richtigen Antwort im Dropdown
  const handleCorrectAnswerChange = (e) => {
    setCurrentQuestion(prev => ({ ...prev, correctAnswerIndex: e.target.value }));
  };

  // ==========================================
  // LOGIK FÜR DIE BUTTONS IN DER PRIMARYCONTENTBOX
  // ==========================================

  const handleSaveQuestion = () => {
    if (!quizRoomTitle.trim() && !quizRoomSaved) {
      alert('Bitte gib zuerst einen Namen für den Quizraum ein!');
      return;
    }
    if (!currentQuestion.questionText.trim()) {
      alert('Bitte gib einen Fragetext ein!');
      return;
    }
    if (currentQuestion.answers.some(ans => !ans.trim())) {
      alert('Bitte gib alle 4 Antworten ein!');
      return;
    }

    // Wenn der Quizraum noch nicht gespeichert ist, speichere ihn zuerst (simuliert Backend-Aufruf)
    if (!quizRoomSaved) {
      const newQuizRoomId = generateUniqueId(); // Eindeutige ID generieren
      console.log(`Simuliere: Quizraum "${quizRoomTitle}" mit ID ${newQuizRoomId} im Backend angelegt.`);
      setQuizRoomId(newQuizRoomId);
      setQuizRoomSaved(true);
      alert(`Quizraum "${quizRoomTitle}" erstellt und erste Frage gespeichert!`);
    } else {
      alert(`Simuliere: Frage zum Quizraum "${quizRoomTitle}" gespeichert.`);
    }

    // Neue Frage zum State hinzufügen (simuliert Speichern im Backend und Abrufen)
    const newQuestion = {
      id: generateUniqueId(),
      quiz_room_id: quizRoomId || 'placeholder-quiz-id', // Nutze die generierte ID oder Platzhalter
      question_text: currentQuestion.questionText,
      answers: currentQuestion.answers,
      correct_answer_index: parseInt(currentQuestion.correctAnswerIndex, 10), // Wichtig: Zahl
    };
    setQuestions(prev => [...prev, newQuestion]);

    // Input-Felder nach dem Speichern zurücksetzen
    setCurrentQuestion({
      questionText: '',
      answers: ['', '', '', ''],
      correctAnswerIndex: '0',
    });
  };

  const handleGoToDashboard = () => {
    console.log('Navigiere zum Dashboard...');
    alert('Du wirst zum Dashboard weitergeleitet!');
    // Hier würde die Navigation zur Mainpage/Dashboard erfolgen, z.B. mit React Router:
    // navigate('/dashboard');
  };

  const primaryBoxButtons = [
    { label: 'Zum Dashboard', type: 'secondary', onClick: handleGoToDashboard },
    { label: 'Frage speichern', type: 'primary', onClick: handleSaveQuestion }
  ];

  // ==========================================
  // LOGIK FÜR DIE BUTTONS IN DER SECONDARYCONTENTBOX (PRO FRAGE)
  // ==========================================

  const handleDeleteQuestion = (questionId) => {
    // Filtere die Frage aus dem State (simuliert Löschen im Backend)
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    console.log(`Simuliere: Frage mit ID ${questionId} gelöscht.`);
    alert(`Frage gelöscht!`);
  };

  const handleEditQuestion = (questionId) => {
    console.log(`Bearbeite Frage mit ID: ${questionId}`);
    alert(`Bearbeiten-Funktion für Frage ${questionId} noch nicht implementiert.`);
    // Hier würde man die Daten der ausgewählten Frage in die Inputfelder der PrimaryContentBox laden
  };

  // ==========================================
  // RENDERING
  // ==========================================

  return (
  <div>
    <NavBar />
    <Header />
    
    <div className="quiz-layout-container">
      {/* PrimaryContentBox für Quizraum-Titel und neue Frage */}
      <PrimaryContentBox
        mode="newQuiz" // Ein neuer Modus für diese Seite
      >
        {!quizRoomSaved && (
          <div className="input-group">
            <label htmlFor="quizRoomName">Name Quizraum:</label>
            <input
              type="text"
              id="quizRoomName"
              name="quizRoomName"
              value={quizRoomTitle}
              onChange={(e) => setQuizRoomTitle(e.target.value)}
              placeholder="Gib den Namen des Quizraums ein"
            />
          </div>
        )}

        {quizRoomSaved && (
          <h2 className="saved-quiz-room-title">QuizRoom: {quizRoomTitle}</h2>
        )}

        <div className="input-group">
          <label htmlFor="questionText">Fragetext:</label>
          <input
            type="text"
            id="questionText"
            name="questionText"
            value={currentQuestion.questionText}
            onChange={handleQuestionInputChange}
            placeholder="Gib deinen Fragetext ein"
          />
        </div>

        {currentQuestion.answers.map((answer, index) => (
          <div className="input-group" key={index}>
            <label htmlFor={`answer${index + 1}`}>Antwort {index + 1}:</label>
            <input
              type="text"
              id={`answer${index + 1}`}
              name={`answer${index + 1}`}
              value={answer}
              onChange={(e) => handleAnswerInputChange(index, e.target.value)}
              placeholder={`Gib Antwort ${index + 1} ein`}
            />
          </div>
        ))}

        <div className="input-group">
          <label htmlFor="correctAnswer">Richtige Antwort:</label>
          <select
            id="correctAnswer"
            name="correctAnswer"
            value={currentQuestion.correctAnswerIndex}
            onChange={handleCorrectAnswerChange}
          >
            <option value="0">Antwort 1</option>
            <option value="1">Antwort 2</option>
            <option value="2">Antwort 3</option>
            <option value="3">Antwort 4</option>
          </select>
        </div>

        <ButtonGroup buttons={primaryBoxButtons} />
      </PrimaryContentBox>

      {/* SecondaryContentBox für die Liste der gespeicherten Fragen */}
      {/* <div className="secondary-content-box"> */}
        {questions.length === 0 ? (
          <SecondaryContentBox mode="emptyList">
            <p>Noch keine Fragen hinzugefügt.</p>
          </SecondaryContentBox>
        ) : (
          questions.map((q, index) => (
            <SecondaryContentBox
              key={q.id} // Wichtig für Listen-Rendering
              mode="newQuiz" // Neuer Modus für detaillierte Fragenansicht
              questionNumberDisplay={`Frage ${index + 1}:`} // Aufsteigende Nummerierung
              questionText={q.question_text}
              answers={q.answers}
              correctAnswerIndex={q.correct_answer_index}
              buttonsData={[
                { label: 'Löschen', type: 'secondary', onClick: () => handleDeleteQuestion(q.id) },
                { label: 'Bearbeiten', type: 'primary', onClick: () => handleEditQuestion(q.id) }
              ]}
            />
          ))
        )}
        {/* </div> */}
        </div>
    </div>
  );
}

export default NewQuizRoomPage;