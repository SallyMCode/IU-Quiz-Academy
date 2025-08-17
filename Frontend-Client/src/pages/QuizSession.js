import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- navigate importieren
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import SecondaryContentbox from '../assets/components/SecondaryContentbox';
import './QuizSession.css';
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import OptionfieldGroup from '../assets/components/OptionfieldGroup';
import { useHttpClient } from '../assets/hooks/http-hook';
import TAGS from '../assets/components/TAGS';

function QuizSession() {
  const location = useLocation();
  const navigate = useNavigate(); // <-- navigate definieren
  const params = new URLSearchParams(location.search);
  const sessionIdFromUrl = params.get('sessionId');
  const quizRoomIdFromState = location.state?.quizRoomId;
  // Public-QuizRoom-Status als Boolean
  const isPublicQuizRoom = location.state?.isPublicQuizRoom === true;
  const [sessionId, setSessionId] = useState(sessionIdFromUrl || null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [quizRoomTitle, setQuizRoomTitle] = useState('');
  const [answerExplanation, setAnswerExplanation] = useState('');
  const [questionStatus, setQuestionStatus] = useState('OPEN'); // "OPEN" | "ANSWERED"
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Index der ausgewählten Antwort
  const [showFeedback, setShowFeedback] = useState(false); // Feedback nach Klick auf Weiter
  const [feedbackType, setFeedbackType] = useState(null); // "correct" | "wrong"
  const [errorMsg, setErrorMsg] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [quizRoomId, setQuizRoomId] = useState(quizRoomIdFromState || null); // State für quizRoomId
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState('quiz'); // Standardwert
  const userId = localStorage.getItem('userId');

  // Session anlegen, falls noch keine vorhanden
  useEffect(() => {
    async function fetchOrCreateSession() {
      if (!sessionId && quizRoomId) {
        try {
          // Lade Fragen, um maxScore zu berechnen
          const questionsData = await sendRequest(`http://localhost:5000/api/questions/room/${quizRoomId}`);
          const maxScore = Array.isArray(questionsData) ? questionsData.length * 100 : 0;

          const data = await sendRequest(
            'http://localhost:5000/api/quizsessions',
            'POST',
            JSON.stringify({
              userId: parseInt(userId, 10),
              quizRoomId,
              public: isPublicQuizRoom,
            }),
            { 'Content-Type': 'application/json' }
          );
          setSessionId(data.id);
          setScore(data.score); // Score aus Session übernehmen
        } catch (err) { }
      } else if (sessionId) {
        // Session laden, falls vorhanden
        try {
          const data = await sendRequest(
            `http://localhost:5000/api/quizsessions/${sessionId}`
          );
          setScore(data.score);
          setQuizRoomId(data.quizRoomId);
          setMode(data.public ? 'publicquiz' : 'quiz'); // Modus aus DB setzen
        } catch (err) { }
      }
    }
    fetchOrCreateSession();
  }, [sessionId, quizRoomId, sendRequest, navigate, isPublicQuizRoom, userId]);

  // Lade alle Fragen für den QuizRoom
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await sendRequest(`http://localhost:5000/api/questions/room/${quizRoomId}`);
        setQuestions(Array.isArray(data) ? data : []);
        // Nur auf 0 setzen, wenn NICHT Resume
        if (!(location.state?.resume && location.state.currentQuestion !== undefined)) {
          setCurrentIdx(0);
        }
      } catch (err) {
        setQuestions([]);
      }
    }
    if (quizRoomId) fetchQuestions();
  }, [quizRoomId, sendRequest, location.state]);

  // Lade Optionen der aktuellen Frage
  useEffect(() => {
    async function fetchOptions() {
      if (questions.length === 0) return;
      const qid = questions[currentIdx]?.id;
      if (!qid) return;
      try {
        const data = await sendRequest(`http://localhost:5000/api/answeroptions/question/${qid}`);
        setOptions(data);
      } catch (err) {
        setOptions([]);
      }
    }
    fetchOptions();
  }, [questions, currentIdx, sendRequest]);

  // Lade QuizRoom-Titel
  useEffect(() => {
    async function fetchRoom() {
      if (!quizRoomId) return;
      try {
        const data = await sendRequest(`http://localhost:5000/api/quizrooms/${quizRoomId}`);
        setQuizRoomTitle(data.title);
      } catch (err) { }
    }
    fetchRoom();
  }, [quizRoomId, sendRequest]);

  // Lade Begründung zur aktuellen Frage
  useEffect(() => {
    async function fetchReason() {
      if (questions.length === 0) return;
      const qid = questions[currentIdx]?.id;
      if (!qid) return;
      try {
        const reasons = await sendRequest(`http://localhost:5000/api/reasons/question/${qid}`);
        const correctIdx = questions[currentIdx]?.correctAnswerIndex;
        const reasonObj = reasons.find(r => r.reasonIndex === correctIdx);
        setAnswerExplanation(reasonObj ? reasonObj.reasonText : '');
      } catch (err) {
        setAnswerExplanation('');
      }
    }
    fetchReason();
  }, [questions, currentIdx, sendRequest]);

  // Reset Status bei neuer Frage
  useEffect(() => {
    setQuestionStatus('OPEN');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedbackType(null);
    setErrorMsg('');
  }, [currentIdx]);

  // Neue Effect für das Laden der Session-Daten
  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      try {
        const sessionData = await sendRequest(`http://localhost:5000/api/quizsessions/${sessionId}`);
        setQuizRoomId(sessionData.quizRoomId);
        setMode(sessionData.public ? 'publicquiz' : 'quiz'); // Modus aus DB setzen
      } catch (err) { }
    }
    fetchSession();
  }, [sessionId, sendRequest]);

  // ...nach dem Laden der Session:
  useEffect(() => {
    if (location.state?.resume && location.state.currentQuestion !== undefined) {
      setCurrentIdx(location.state.currentQuestion);
    }
    if (location.state?.resume && location.state.score !== undefined) {
      setScore(location.state.score);
    }
  }, [location.state]);

  if (isLoading || questions.length === 0 || !sessionId) {
    return <div className="spinner">Lade Quiz...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const currentQuestion = questions[currentIdx];
  const correctAnswerIndex = currentQuestion?.correctAnswerIndex;

  // Handler für Antwortauswahl
  const handleOptionClick = (option, idx) => {
    // Keine Auswahl nach Auswertung oder nach Abschluss
    if (questionStatus === 'ANSWERED' || questionStatus === 'FINISHED') return;
    setSelectedAnswer(idx);
    setErrorMsg('');
    setShowFeedback(false);
    setFeedbackType(null);
    setQuestionStatus('SELECTED');
  };

  // Handler für Weiter-Button
  const handleNextQuestion = async () => {
    // Nur im Status 'SELECTED' oder 'FINISHED' darf weitergeklickt werden
    if (questionStatus !== 'SELECTED' && questionStatus !== 'FINISHED') return;

    // Wenn Status 'FINISHED', direkt zur nächsten Frage
    if (questionStatus === 'FINISHED') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setQuestionStatus('OPEN');
        setShowFeedback(false);
        setSelectedAnswer(null);
      } else {
        handleFinishQuiz();
      }
      return;
    }

    // Auswertung durchführen
    const isCorrect = selectedAnswer === correctAnswerIndex;
    setQuestionStatus('ANSWERED');
    setShowFeedback(true);
    setFeedbackType(isCorrect ? 'correct' : 'wrong');
    if (isCorrect && sessionId) {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/quizsessions/${sessionId}/score`,
          'PATCH',
          JSON.stringify({ addScore: 100 }),
          { 'Content-Type': 'application/json' }
        );
        setScore(data.score); // Score aktualisieren
      } catch (err) { }
    }
    // last_action updaten
    if (sessionId) {
      try {
        await sendRequest(
          `http://localhost:5000/api/quizsessions/${sessionId}/lastaction`,
          'PATCH',
          JSON.stringify({ lastAction: new Date() }),
          { 'Content-Type': 'application/json' }
        );
      } catch (err) { }
    }
    // current_question updaten
    if (sessionId) {
      try {
        await sendRequest(
          `http://localhost:5000/api/quizsessions/${sessionId}/currentquestion`,
          'PATCH',
          JSON.stringify({ currentQuestion: currentIdx }),
          { 'Content-Type': 'application/json' }
        );
      } catch (err) { }
    }

    // Nach 2 Sekunden Status auf 'FINISHED' setzen, damit der Nutzer weiterklicken kann
    setTimeout(() => {
      setQuestionStatus('FINISHED');
    }, 1000);
  };

  const handleCancelQuiz = () => {
    navigate('/Dashboard');
  };

  const handleFinishQuiz = async () => {
    if (sessionId) {
      try {
        await sendRequest(
          `http://localhost:5000/api/quizsessions/${sessionId}/end`,
          'PATCH'
        );
        // Optional: Weiterleitung oder Abschlussanzeige
        navigate('/SuccessPage', { state: { sessionId, isPublicQuizRoom, quizRoomTitle, imageType: secondaryImage } });
      } catch (err) { }
    }
  };

  // Farben
  const quizRoomTitleColor = isPublicQuizRoom ? '#2563EB' : '#ffc107'; // Blau oder Gelb
  const customBorder = isPublicQuizRoom ? "blue" : "yellow";
  const secondaryBorder = isPublicQuizRoom ? "blue" : "yellow";

  // OptionFieldGroup: Option-Farbe
  function getOptionColor(idx) {
    if (questionStatus === 'SELECTED') {
      return selectedAnswer === idx ? 'selected' : (mode === 'publicquiz' ? 'blue' : 'yellow');
    }
    if (questionStatus === 'ANSWERED' || questionStatus === 'FINISHED') {
      if (selectedAnswer === correctAnswerIndex) {
        return idx === correctAnswerIndex ? 'correct' : (mode === 'publicquiz' ? 'blue' : 'yellow');
      } else {
        if (idx === selectedAnswer) return 'wrong';
        if (idx === correctAnswerIndex) return 'correct';
        return mode === 'publicquiz' ? 'blue' : 'yellow';
      }
    }
    return mode === 'publicquiz' ? 'blue' : 'yellow';
  }

  // SecondaryContentbox: Bild und Reasontext dynamisch setzen
  let secondaryImage = 'thinking';
  let reasonColor = '';

  if (showFeedback) {
    if (feedbackType === 'correct') {
      secondaryImage = 'thumbsUP';
      reasonColor = '#24ac24';
    } else if (feedbackType === 'wrong') {
      secondaryImage = 'wrong';
      reasonColor = '#d32f2f';
    }
  } else {
    reasonColor = '#000'; // Standardfarbe für Reasontext
  }

  // Reasontext für SecondaryContentbox
  const reasonSection = showFeedback && answerExplanation ? (
    feedbackType === 'wrong' ? (
      <div style={{ marginTop: 24, textAlign: 'left' }}>
        <TAGS
          status="Negative"
          text={<><strong>Begründung:</strong> {answerExplanation}</>}
        />
      </div>
    ) : feedbackType === 'correct' ? (
      <div style={{ marginTop: 24, textAlign: 'left' }}>
        <TAGS status="Positive"
          text={<><strong>Begründung:</strong> {answerExplanation}</>} />
      </div>
    ) : (
      <div style={{ marginTop: 24 }}>
        <h4 style={{ color: reasonColor, marginBottom: 8 }}>Begründung</h4>
        <div style={{ color: reasonColor, fontWeight: 500 }}>{answerExplanation}</div>
      </div>
    )
  ) : null;

  const buttonsData = [
    {
      label: 'Abbrechen',
      onClick: handleCancelQuiz,
      type: 'secondary',
      variant: 'outlined',
      size: 'large',
      style: { minWidth: 120 }
    },
    {
      label: 'Weiter',
      onClick: handleNextQuestion,
      type: 'primary',
      variant: 'contained',
      size: 'large',
      style: { minWidth: 120 },
      disabled: questionStatus === 'ANSWERED' // Nur im Status 'ANSWERED' deaktivieren
    }
  ];

  return (
    <div>
      <NavBar />
      <div className="quiz-layout-container">
        <PrimaryContentbox
          mode={mode}
          questionText={currentQuestion.questionText}
          options={options.map((opt, idx) => ({
            ...opt,
            optionColor: getOptionColor(idx)
          }))}
          onOptionClick={handleOptionClick}
          buttons={buttonsData}
          customBorder={mode === 'publicquiz' ? "blue" : "yellow"}
        />
        <SecondaryContentbox
          mode={mode}
          quizRoom={quizRoomTitle}
          questionNumber={`Frage ${currentIdx + 1} von ${questions.length}`}
          data={{ totalPoints: score }}
          customBorder={mode === 'publicquiz' ? "blue" : "yellow"}
          imageType={secondaryImage}
          quizRoomTitleColor={mode === 'publicquiz' ? '#2563EB' : '#ffc107'}
        >
          {reasonSection}
        </SecondaryContentbox>
      </div>
      {errorMsg && (
        <div style={{ color: '#d32f2f', background: '#fffbe6', padding: 12, borderRadius: 8, textAlign: 'center', marginTop: 16 }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default QuizSession;
