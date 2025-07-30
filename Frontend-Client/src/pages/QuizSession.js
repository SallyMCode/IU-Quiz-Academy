import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import SecondaryContentbox from '../assets/components/SecondaryContentbox';
import './QuizSession.css';
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import OptionfieldGroup from '../assets/components/OptionfieldGroup';

function QuizSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const quizRoomId = params.get('quizRoomId');
  const sessionIdFromUrl = params.get('sessionId');

  const [sessionId, setSessionId] = useState(sessionIdFromUrl || null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [quizRoomTitle, setQuizRoomTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [userQuizRooms, setUserQuizRooms] = useState([]);
  const [error, setError] = useState(null);

  // Session anlegen, falls noch keine vorhanden
  useEffect(() => {
    async function startSession() {
      if (sessionId) return; // Session schon vorhanden
      try {
        // Hier ggf. userId dynamisch holen!
        const response = await fetch('http://localhost:5000/api/quizsessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, quizRoomId }) // userId ggf. ersetzen!
        });
        if (!response.ok) throw new Error('Quizsession konnte nicht gestartet werden');
        const data = await response.json();
        setSessionId(data.id);
        // URL aktualisieren, damit sessionId sichtbar ist
        navigate(`/Quizsession?quizRoomId=${quizRoomId}&sessionId=${data.id}`, { replace: true });
      } catch (err) {
        setError('Fehler beim Starten der Quizsession: ' + err.message);
      }
    }
    startSession();
    // eslint-disable-next-line
  }, [quizRoomId]);

  // Lade alle Fragen für den QuizRoom
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/questions/room/${quizRoomId}`);
        if (!res.ok) throw new Error('Fragen konnten nicht geladen werden');
        const data = await res.json();
        setQuestions(data);
        setCurrentIdx(0);
      } catch (err) {
        setError('Fehler beim Laden der Fragen: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    if (quizRoomId) fetchQuestions();
  }, [quizRoomId]);

  // Lade Optionen der aktuellen Frage
  useEffect(() => {
    async function fetchOptions() {
      if (questions.length === 0) return;
      const qid = questions[currentIdx]?.id;
      if (!qid) return;
      try {
        const res = await fetch(`http://localhost:5000/api/answeroptions/question/${qid}`);
        if (!res.ok) throw new Error('Antwortoptionen konnten nicht geladen werden');
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        setError('Fehler beim Laden der Antwortoptionen: ' + err.message);
      }
    }
    fetchOptions();
  }, [questions, currentIdx]);

  // Lade QuizRoom-Titel
  useEffect(() => {
    async function fetchRoom() {
      if (!quizRoomId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/quizrooms/${quizRoomId}`);
        if (!res.ok) throw new Error('QuizRoom konnte nicht geladen werden');
        const data = await res.json();
        setQuizRoomTitle(data.title);
      } catch (err) {
        setError('Fehler beim Laden des QuizRooms: ' + err.message);
      }
    }
    fetchRoom();
  }, [quizRoomId]);

  if (loading || questions.length === 0 || !sessionId) {
    return <div className="spinner">Lade Quiz...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const currentQuestion = questions[currentIdx];

  // Handler
  const handleOptionClick = (selectedOption) => {
    console.log("Ausgewählte Option:", selectedOption);
    alert(`Du hast "${selectedOption}" ausgewählt!`);
  };

  const handleNextQuestion = () => {
    console.log("Navigiere zur nächsten Frage...");
    setCurrentIdx((idx) => idx + 1);
  };

  const handleCancelQuiz = () => {
    console.log("Quiz wird abgebrochen...");
    navigate('/Dashboard'); // Navigiert zur Route /Dashboard;
  };

  const buttonsData = [
    { label: "Abbrechen", type: "secondary", onClick: handleCancelQuiz },
    { label: "Weiter", type: "primary", onClick: handleNextQuestion }
  ];

  return (
    <div>
      <NavBar />
      <div className="quiz-layout-container">
        <PrimaryContentbox
          mode="quiz"
          questionText={currentQuestion.questionText}
          options={options}
          onOptionClick={handleOptionClick}
          buttons={buttonsData}
        />
        <SecondaryContentbox
          mode="quiz"
          quizRoom={quizRoomTitle}
          questionNumber={`Frage ${currentIdx + 1} von ${questions.length}`}
          data={{
            totalPoints: "4",
          }}
        />
      </div>
    </div>
  );
}

export default QuizSession;
