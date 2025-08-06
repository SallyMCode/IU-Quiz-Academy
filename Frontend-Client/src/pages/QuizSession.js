import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- navigate importieren
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import SecondaryContentbox from '../assets/components/SecondaryContentbox';
import './QuizSession.css';
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import OptionfieldGroup from '../assets/components/OptionfieldGroup';
import { useHttpClient } from '../assets/hooks/http-hook';

function QuizSession() {
  const location = useLocation();
  const navigate = useNavigate(); // <-- navigate definieren
  const params = new URLSearchParams(location.search);
  const sessionIdFromUrl = params.get('sessionId');
  const quizRoomIdFromState = location.state?.quizRoomId;
  const isPublicQuizRoom = location.state?.isPublicQuizRoom || true;
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
   const userId = localStorage.getItem('userId');

  // Session anlegen, falls noch keine vorhanden
  useEffect(() => {
    async function fetchOrCreateSession() {
      if (!sessionId && quizRoomId) {
        try {
          const data = await sendRequest(
            'http://localhost:5000/api/quizsessions',
            'POST',
            JSON.stringify({ userId: parseInt(userId, 10), quizRoomId }),
            { 'Content-Type': 'application/json' }
          );
          setSessionId(data.id);
          setScore(data.score); // Score aus Session übernehmen
          navigate(`/Quizsession?sessionId=${data.id}`);
        } catch (err) {}
      } else if (sessionId) {
        // Session laden, falls vorhanden
        try {
          const data = await sendRequest(
            `http://localhost:5000/api/quizsessions/${sessionId}`
          );
          setScore(data.score);
          setQuizRoomId(data.quizRoomId);
        } catch (err) {}
      }
    }
    fetchOrCreateSession();
  }, [sessionId, quizRoomId, sendRequest, navigate]);

  // Lade alle Fragen für den QuizRoom
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await sendRequest(`http://localhost:5000/api/questions/room/${quizRoomId}`);
        setQuestions(Array.isArray(data) ? data : []);
        setCurrentIdx(0);
      } catch (err) {
        setQuestions([]);
      }
    }
    if (quizRoomId) fetchQuestions();
  }, [quizRoomId, sendRequest]);

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
      } catch (err) {}
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
        setQuizRoomId(sessionData.quizRoomId); // Füge einen State für quizRoomId hinzu
      } catch (err) {}
    }
    fetchSession();
  }, [sessionId, sendRequest]);

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
    if (questionStatus === 'ANSWERED') return; // Keine Auswahl nach Auswertung
    setSelectedAnswer(idx); // Auswahl speichern
    setErrorMsg('');
    setShowFeedback(false);
    setFeedbackType(null);
    setQuestionStatus('SELECTED'); // Status: Option ausgewählt, aber noch nicht ausgewertet
  };

  // Handler für Weiter-Button
  const handleNextQuestion = async () => {
    if (questionStatus !== 'SELECTED') return; // Weiter nur nach Auswahl möglich
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
      } catch (err) {}
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
      } catch (err) {}
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
      } catch (err) {}
    }
    // Nach kurzer Zeit zur nächsten Frage wechseln
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setQuestionStatus('OPEN');
        setShowFeedback(false);
        setSelectedAnswer(null);
      } else {
        handleFinishQuiz();
      }
    }, 10000); // z.B. 3 Sekunden Feedback anzeigen
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
        navigate('/SuccessPage', { state: { sessionId } });
      } catch (err) {}
    }
  };

  // OptionFieldGroup: Option-Farben dynamisch setzen
  const getOptionColor = idx => {
    if (showFeedback) {
      if (feedbackType === 'correct') {
        if (idx === selectedAnswer) return 'green'; // Richtig beantwortet
        return null;
      } else if (feedbackType === 'wrong') {
        if (idx === selectedAnswer) return 'red'; // Falsch beantwortet
        if (idx === correctAnswerIndex) return 'green'; // Richtige Antwort hervorheben
        return null;
      }
    } else {
      if (selectedAnswer === idx) return 'blue'; // Ausgewählt
      return null; // Standard (gelb)
    }
  };

  // Buttons für die PrimaryContentbox
  const buttonsData = [
    { label: "Abbrechen", type: "secondary", onClick: handleCancelQuiz },
    {
      label: "Weiter",
      type: "primary",
      onClick: handleNextQuestion,
      disabled: questionStatus !== 'SELECTED' // Weiter nur aktiv, wenn Option ausgewählt
    }
  ];

  // OptionFieldGroup für PrimaryContentbox
  const optionFieldGroup = (
    <OptionfieldGroup
      options={options.map((opt, idx) => ({
        ...opt,
        optionColor: isPublicQuizRoom ? 'blue' : getOptionColor(idx)
      }))}
      onOptionClick={(option, idx) => {
        if (!showFeedback) handleOptionClick(option, idx);
      }}
    />
  );

  // SecondaryContentbox: Randfarbe, Bild und Reasontext dynamisch setzen
  let secondaryBorder = '';
  let secondaryImage = 'thinking';
  let reasonColor = '';
  let quizRoomTitleColor = isPublicQuizRoom ? '#2563EB' : '#ffc107'; // Blau oder Gelb

  if (showFeedback) {
    if (feedbackType === 'correct') {
      secondaryBorder = isPublicQuizRoom ? 'blue' : '#1a7a1a';
      secondaryImage = 'thumbsUP';
      reasonColor = isPublicQuizRoom ? '#2563EB' : '#1a7a1a';
    } else if (feedbackType === 'wrong') {
      secondaryBorder = isPublicQuizRoom ? 'blue' : '#d32f2f';
      secondaryImage = 'wrong';
      reasonColor = isPublicQuizRoom ? '#2563EB' : '#d32f2f';
    }
  } else {
    secondaryBorder = isPublicQuizRoom ? 'blue' : '';
    reasonColor = isPublicQuizRoom ? '#2563EB' : '';
  }

  // Reasontext für SecondaryContentbox
  const reasonSection = showFeedback && answerExplanation ? (
    <div style={{ marginTop: 24 }}>
      <h4 style={{ color: reasonColor, marginBottom: 8 }}>Begründung</h4>
      <div style={{ color: reasonColor, fontWeight: 500 }}>{answerExplanation}</div>
    </div>
  ) : null;

  return (
    <div>
      <NavBar />
      <div className="quiz-layout-container">
        <PrimaryContentbox
          mode={isPublicQuizRoom ? "publicquiz" : "quiz"}
          questionNumber={`Frage ${currentIdx + 1} von ${questions.length}`}
          questionText={currentQuestion.questionText}
          options={options.map((opt, idx) => ({
            ...opt,
            optionColor: isPublicQuizRoom ? 'blue' : getOptionColor(idx)
          }))}
          onOptionClick={handleOptionClick}
          buttons={buttonsData}
          customBorder={isPublicQuizRoom ? "blue" : secondaryBorder}
        />
        <SecondaryContentbox
          mode={isPublicQuizRoom ? "publicquiz" : "quiz"}
          quizRoom={quizRoomTitle}
          questionNumber={`Frage ${currentIdx + 1} von ${questions.length}`}
          data={{ totalPoints: score }}
          customBorder={isPublicQuizRoom ? "blue" : secondaryBorder}
          imageType={secondaryImage}
          quizRoomTitleColor={quizRoomTitleColor}
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
