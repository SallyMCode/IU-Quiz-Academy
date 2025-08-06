import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import ButtonGroup from '../assets/components/ButtonGroup';
import './NewQuizRoomPage.css'; 
import { useHttpClient } from '../assets/hooks/http-hook';

const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

function NewQuizRoomPage() {
  const navigate = useNavigate();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const [quizRoomTitle, setQuizRoomTitle] = useState('');
  const [quizRoomSaved, setQuizRoomSaved] = useState(false);
  const [quizRoomId, setQuizRoomId] = useState(null);
  const [titleInputYellow, setTitleInputYellow] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: '0',
    answerExplanation: ''
  });

  const [questions, setQuestions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);
  const [editQuestionId, setEditQuestionId] = useState(null);

  const userId = localStorage.getItem('userId'); // UserID holen

  // Request zur QuizRoom-Anlage nach Verlassen des Textfeldes
  const handleQuizRoomBlur = async () => {
    if (quizRoomTitle.trim().length >= 3 && !quizRoomSaved) {
      try {
        const quizRoomResponse = await sendRequest(
          'http://localhost:5000/api/quizrooms',
          'POST',
          JSON.stringify({
            title: quizRoomTitle,
            public: false,
            creatorId: parseInt(userId, 10) // <-- UserID als CreatorID übergeben
          }),
          { 'Content-Type': 'application/json' }
        );
        setQuizRoomId(quizRoomResponse.id);
        setQuizRoomSaved(true);
        setTitleInputYellow(true);
      } catch (err) {
        alert('QuizRoom konnte nicht angelegt werden: ' + err.message);
      }
    }
  };

  // Handler für Änderungen im QuizRoom-Titel
  const handleQuizRoomTitleChange = (e) => {
    setQuizRoomTitle(e.target.value);
    setTitleInputYellow(false); // Farbe zurücksetzen, wenn geändert wird
  };

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

  // EIN Button zum Speichern der Frage
  const handleSaveQuestion = async () => {
    if (!quizRoomSaved || !quizRoomId) {
      alert('Bitte gib zuerst einen gültigen Namen für den Quizraum ein und verlasse das Feld!');
      return;
    }
    if (!currentQuestion.questionText || currentQuestion.questionText.trim().length < 5) {
      alert('Der Fragetext muss mindestens 5 Zeichen lang sein!');
      return;
    }
    if (currentQuestion.answers.some(ans => !ans.trim())) {
      alert('Bitte gib alle 4 Antworten ein!');
      return;
    }

    try {
      let questionId = editMode ? editQuestionId : null;

      if (editMode) {
        // 1. Frage updaten
        await sendRequest(
          `http://localhost:5000/api/questions/${questionId}`,
          'PUT',
          JSON.stringify({
            questionText: currentQuestion.questionText,
            correctAnswerIndex: parseInt(currentQuestion.correctAnswerIndex, 10),
            quizRoomId: quizRoomId
          }),
          { 'Content-Type': 'application/json' }
        );

        // 2. Antwortoptionen updaten
        const options = await sendRequest(
          `http://localhost:5000/api/answeroptions/question/${questionId}`,
          'GET'
        );
        for (let i = 0; i < options.length; i++) {
          await sendRequest(
            `http://localhost:5000/api/answeroptions/${options[i].id}`,
            'PUT',
            JSON.stringify({
              optionText: currentQuestion.answers[i],
              optionIndex: i
            }),
            { 'Content-Type': 'application/json' }
          );
        }

        // 3. Begründung updaten (nur wenn vorhanden)
        const reasons = await sendRequest(
          `http://localhost:5000/api/reasons/question/${questionId}`,
          'GET'
        );
        if (reasons.length > 0) {
          await sendRequest(
            `http://localhost:5000/api/reasons/${reasons[0].id}`,
            'PUT',
            JSON.stringify({
              reasonText: currentQuestion.answerExplanation,
              reasonIndex: parseInt(currentQuestion.correctAnswerIndex, 10)
            }),
            { 'Content-Type': 'application/json' }
          );
        } else if (currentQuestion.answerExplanation && currentQuestion.answerExplanation.trim().length > 0) {
          // Falls keine Begründung existiert, neu anlegen
          await sendRequest(
            'http://localhost:5000/api/reasons',
            'POST',
            JSON.stringify({
              questionId: questionId,
              reasonText: currentQuestion.answerExplanation,
              reasonIndex: parseInt(currentQuestion.correctAnswerIndex, 10)
            }),
            { 'Content-Type': 'application/json' }
          );
        }

        // Lokalen State aktualisieren
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = {
          ...updatedQuestions[editQuestionIndex],
          question_text: currentQuestion.questionText,
          answers: [...currentQuestion.answers],
          correct_answer_index: parseInt(currentQuestion.correctAnswerIndex, 10),
          answer_explanation: currentQuestion.answerExplanation || '',
        };
        setQuestions(updatedQuestions);

        setEditMode(false);
        setEditQuestionIndex(null);
        setEditQuestionId(null);
        setCurrentQuestion({
          questionText: '',
          answers: ['', '', '', ''],
          correctAnswerIndex: '0',
          answerExplanation: ''
        });
        alert('Frage erfolgreich aktualisiert!');
        return;
      }

      // 1. Frage anlegen
      const questionResponse = await sendRequest(
        'http://localhost:5000/api/questions',
        'POST',
        JSON.stringify({
          quizRoomId: quizRoomId,
          questionText: currentQuestion.questionText,
          correctAnswerIndex: parseInt(currentQuestion.correctAnswerIndex, 10)
        }),
        { 'Content-Type': 'application/json' }
      );
      questionId = questionResponse.id;

      // 2. Antwortoptionen anlegen
      for (let i = 0; i < currentQuestion.answers.length; i++) {
        await sendRequest(
          'http://localhost:5000/api/answeroptions',
          'POST',
          JSON.stringify({
            questionId: questionId,
            optionIndex: i,
            optionText: currentQuestion.answers[i]
          }),
          { 'Content-Type': 'application/json' }
        );
      }

      // 3. Begründung zur richtigen Antwort speichern
      if (currentQuestion.answerExplanation && currentQuestion.answerExplanation.trim().length > 0) {
        await sendRequest(
          'http://localhost:5000/api/reasons',
          'POST',
          JSON.stringify({
            questionId: questionId,
            reasonText: currentQuestion.answerExplanation,
            reasonIndex: parseInt(currentQuestion.correctAnswerIndex, 10)
          }),
          { 'Content-Type': 'application/json' }
        );
      }

      // Frage lokal speichern (optional für Anzeige)
      const newQuestion = {
        id: questionId,
        quiz_room_id: quizRoomId,
        question_text: currentQuestion.questionText,
        answers: currentQuestion.answers,
        correct_answer_index: parseInt(currentQuestion.correctAnswerIndex, 10),
        answer_explanation: currentQuestion.answerExplanation || '',
      };
      setQuestions(prev => [...prev, newQuestion]);

      // Felder zurücksetzen
      setCurrentQuestion({
        questionText: '',
        answers: ['', '', '', ''],
        correctAnswerIndex: '0',
        answerExplanation: ''
      });

    } catch (err) {
      alert('Fehler beim Speichern der Frage: ' + err.message);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/Dashboard');
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      // 1. Begründungen zur Frage löschen
      await sendRequest(
        `http://localhost:5000/api/reasons/question/${questionId}`,
        'GET'
      );
      const reasons = await sendRequest(
        `http://localhost:5000/api/reasons/question/${questionId}`,
        'GET'
      );
      for (const reason of reasons) {
        await sendRequest(
          `http://localhost:5000/api/reasons/${reason.id}`,
          'DELETE'
        );
      }

      // 2. Antwortoptionen zur Frage löschen
      const options = await sendRequest(
        `http://localhost:5000/api/answeroptions/question/${questionId}`,
        'GET'
      );
      for (const option of options) {
        await sendRequest(
          `http://localhost:5000/api/answeroptions/${option.id}`,
          'DELETE'
        );
      }

      // 3. Frage selbst löschen
      await sendRequest(
        `http://localhost:5000/api/questions/${questionId}`,
        'DELETE'
      );

      // 4. Lokalen State aktualisieren
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      alert(`Frage und zugehörige Daten gelöscht!`);
    } catch (err) {
      alert('Fehler beim Löschen der Frage: ' + err.message);
    }
  };

  const handleEditQuestion = (questionId) => {
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx === -1) return;
    setEditMode(true);
    setEditQuestionIndex(idx);
    setEditQuestionId(questionId);
    const q = questions[idx];
    setCurrentQuestion({
      questionText: q.question_text,
      answers: [...q.answers],
      correctAnswerIndex: q.correct_answer_index.toString(),
      answerExplanation: q.answer_explanation || ''
    });
  };

  const primaryBoxButtons = [
    { label: 'Zum Dashboard', type: 'secondary', onClick: handleGoToDashboard },
    { label: 'Frage speichern', type: 'primary', onClick: handleSaveQuestion }
  ];

  return (
    <div>
      <NavBar />
      <Header />
      <div className="quiz-layout-container">
        <PrimaryContentBox
          mode="newQuiz"
        >
          {!quizRoomSaved && (
            <div className="input-group">
              <label htmlFor="quizRoomName">Name Quizraum:</label>
              <input
                type="text"
                id="quizRoomName"
                name="quizRoomName"
                value={quizRoomTitle}
                onChange={handleQuizRoomTitleChange}
                onBlur={handleQuizRoomBlur}
                placeholder="Gib den Namen des Quizraums ein"
                style={titleInputYellow ? { backgroundColor: '#fffbe6', borderColor: '#ffc107' } : {}}
              />
            </div>
          )}

          {quizRoomSaved && (
            <h2 className="saved-quiz-room-title" style={{ color: '#ffc107' }}>
              QuizRoom: {quizRoomTitle}
            </h2>
          )}

          {editMode && (
            <div style={{ textAlign: 'center', color: '#ffc107', fontWeight: 600, fontSize: '1.2em', marginBottom: 16 }}>
              Frage {editQuestionIndex + 1} wird bearbeitet
            </div>
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

          <div className="input-group">
            <label htmlFor="answerExplanation">Begründung zur richtigen Antwort:</label>
            <input
              type="text"
              id="answerExplanation"
              name="answerExplanation"
              value={currentQuestion.answerExplanation || ''}
              onChange={e =>
                setCurrentQuestion(prev => ({
                  ...prev,
                  answerExplanation: e.target.value
                }))
              }
              placeholder="Gib eine Begründung für die richtige Antwort ein"
            />
          </div>

          <ButtonGroup buttons={primaryBoxButtons} />
        </PrimaryContentBox>

        <div className="secondary-content-box">
          {questions.length === 0 ? (
            <SecondaryContentBox mode="emptyList">
              <p>Noch keine Fragen hinzugefügt.</p>
            </SecondaryContentBox>
          ) : 
            questions.map((q, index) => (
              <SecondaryContentBox
                key={q.id}
                mode="newQuiz"
                questionNumberDisplay={`Frage ${index + 1}:`}
                questionText={q.question_text}
                answers={q.answers}
                correctAnswerIndex={q.correct_answer_index}
                buttonsData={[
                  {
                    label: 'Löschen',
                    type: 'secondary',
                    onClick: () => handleDeleteQuestion(q.id),
                    disabled: editMode && editQuestionId === q.id
                  },
                  {
                    label: 'Bearbeiten',
                    type: 'primary',
                    onClick: () => handleEditQuestion(q.id),
                    disabled: editMode && editQuestionId === q.id
                  }
                ]}
                highlight={editMode && editQuestionId === q.id} 
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default NewQuizRoomPage;