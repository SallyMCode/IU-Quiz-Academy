import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import NavBar from '../assets/components/NavBar';
import { useHttpClient } from '../assets/hooks/http-hook';
import './SuccessPage.css';
import QuizFinished from '../assets/images/QuizFinished.png';
import TAGS from '../assets/components/TAGS';

const SuccessPage = () => {
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const { isPublicQuizRoom } = location.state || {};
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [worstScore, setWorstScore] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      const session = await sendRequest(`http://localhost:5000/api/quizsessions/${sessionId}`);
      if (!session) return;
      setSessionData(session);

      const userId = session.userId || session.user?.id;
      const quizRoomId = session.quizRoomId || session.quizRoom?.id;

      const scores = await sendRequest(
        `http://localhost:5000/api/quizsessions/userroom?userId=${userId}&quizRoomId=${quizRoomId}`
      );
      const allScores = scores.map(s => s.score);
      setBestScore(Math.max(...allScores));
      setWorstScore(Math.min(...allScores));
    }
    fetchSession();
  }, [sessionId, sendRequest]);

  if (!sessionData) return <div className="spinner">Lade Ergebnis...</div>;

  const score = sessionData.score;
  const maxScore = ((sessionData.currentQuestion + 1) * 100);
  const currentScoreDisplay = `${score} von ${maxScore} Punkten`;

  const handleRestartQuiz = () => {
    navigate('/userquizrooms');
  };
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const buttonsData = [
    { label: "Quiz Rooms", type: "secondary", onClick: handleRestartQuiz },
    { label: "Dashboard", type: "primary", onClick: handleGoToDashboard }
  ];

  const customBorder = isPublicQuizRoom ? 'blue' : 'yellow';

  // Props für PrimaryContentbox
  const mainMessage = "🏆Geschafft! Quiz beendet...";
  const subMessage = "Sieh dir deinen Score im Vergleich zu anderen an";

  // Tag-Komponenten für die Anzeige (nur SuccessPage größer/bold)
  const tagStyle = { fontSize: '1.25rem', fontWeight: 'bold' };
  const scoreTag = <TAGS status="High" text={`💯Dein Score: ${currentScoreDisplay}`} style={tagStyle} />;
  const bestScoreTag = <TAGS status="Positive" text={`Bester Score: ${bestScore}`} style={tagStyle} />;
  const worstScoreTag = <TAGS status="Negative" text={`🥉Schlechtester Score: ${worstScore}`} style={tagStyle} />;

  return (
    <div>
      <NavBar />
      <div className="quiz-layout-container" style={{ justifyContent: 'center' }}>
        <PrimaryContentBox
          mode="result"
          mainMessage={mainMessage}
          subMessage={subMessage}
          buttons={buttonsData}
          customBorder={customBorder}
          currentScoreTag={scoreTag}
          bestScoreTag={bestScoreTag}
          worstScoreTag={worstScoreTag}
          showResultContent={true}
          quizFinishedImage={QuizFinished}
        />
      </div>
    </div>
  );
};

export default SuccessPage;