import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import { useHttpClient } from '../assets/hooks/http-hook';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const { sendRequest } = useHttpClient();

  const [sessionData, setSessionData] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [worstScore, setWorstScore] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      // Session-Daten laden
      const session = await sendRequest(`http://localhost:5000/api/quizsessions/${sessionId}`);
      setSessionData(session);

      // Best-/Worst-Score für User und QuizRoom laden
      const scores = await sendRequest(
        `http://localhost:5000/api/quizsessions?userId=${session.userId}&quizRoomId=${session.quizRoomId}`
      );
      const allScores = scores.map(s => s.score);
      setBestScore(Math.max(...allScores));
      setWorstScore(Math.min(...allScores));
    }
    fetchSession();
  }, [sessionId, sendRequest]);

  if (!sessionData) return <div className="spinner">Lade Ergebnis...</div>;

  // Werte berechnen
  const quizRoomName = sessionData.quizRoom?.title || '';
  const score = sessionData.score;
  const maxScore = ((sessionData.currentQuestion + 1) * 100);
  const currentScoreDisplay = `${score} von ${maxScore} Punkten`;

  // Button-Handler
  const handleRestartQuiz = () => {
    Navigate('/userquizroom')
    console.log("Zu QuizRoom navigieren...");
  };
  const handleGoToDashboard = () => {
    Navigate('/dashboard');
    console.log("Zum Dashboard navigieren...");
  };

  const buttonsData = [
    { label: "Quiz Rooms", type: "secondary", onClick: handleRestartQuiz },
    { label: "Dashboard", type: "primary", onClick: handleGoToDashboard }
  ];

  return (
    <div>
      <NavBar />
      <div className="quiz-layout-container">
        <PrimaryContentBox
          mode="result"
          mainMessage="Geschafft! Quiz beendet..."
          subMessage="Sieh dir deinen Score im Vergleich zu anderen an"
          buttons={buttonsData}
        />
        <SecondaryContentBox
          mode="result"
          quizRoom={quizRoomName}
          currentScore={currentScoreDisplay}
          lastScore={score}
          bestScore={bestScore}
          worstScore={worstScore}
        />
      </div>
    </div>
  );
};

export default SuccessPage;