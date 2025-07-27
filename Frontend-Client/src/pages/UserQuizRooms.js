import React, { useEffect, useState } from 'react';
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import OptionFieldGroup from '../assets/components/OptionfieldGroup';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import { useNavigate } from 'react-router-dom';
import './UserQuizRooms.css';

const STATIC_PUBLIC_QUIZROOMS = [
  'Allgemeinwissen',
  'Mathematik für IT',
  'Englisch Basics',
  'Projektmanagement',
];

function UserQuizRooms() {
  const [userQuizRooms, setUserQuizRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Statische User-ID für Demo
  const userId = 1;

  useEffect(() => {
    async function fetchUserQuizRooms() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/quizrooms');
        if (!response.ok) throw new Error('QuizRooms konnten nicht geladen werden');
        const allRooms = await response.json();
        const myRooms = allRooms.filter(room => room.creator && room.creator.id === userId);
        setUserQuizRooms(myRooms);
      } catch (err) {
        setError(err.message);
        setUserQuizRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserQuizRooms();
  }, []);

  return (
    <div>
      <NavBar />
      <Header />

      <div className="user-quizrooms-page">
        <PrimaryContentbox mode="newQuiz" customBorder="yellow">
          <div className="quizroom-header-row">
            <h1>🧑‍🏫</h1><h2 className="section-title">Meine Quiz Rooms</h2>
          </div>
          {loading ? (
            <div className="spinner">Lade QuizRooms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : userQuizRooms.length === 0 ? (
            <div className="empty-message">Du hast noch keine eigenen QuizRooms.</div>
          ) : (
            <OptionFieldGroup
              options={userQuizRooms.map(room => room.title)}
              onOptionClick={roomTitle => alert(`QuizRoom "${roomTitle}" ausgewählt`)}
            />
          )}
          <div className="add-quizroom-bottom">
            <span
              className="add-quizroom-icon"
              title="Neuen QuizRoom anlegen"
              onClick={() => navigate('/NewQuizroom')}
              role="button"
              tabIndex={0}
            >
              {/* Gelbes Plus-Symbol als SVG */}
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#FFC107"/>
                <rect x="14" y="8" width="4" height="16" rx="2" fill="white"/>
                <rect x="8" y="14" width="16" height="4" rx="2" fill="white"/>
              </svg>
            </span>
          </div>
        </PrimaryContentbox>

        <PrimaryContentbox mode="newQuiz" customBorder="blue">
          <h2 className="section-title blue-title">Öffentliche Quiz Rooms</h2>
          <OptionFieldGroup
            options={STATIC_PUBLIC_QUIZROOMS}
            onOptionClick={roomTitle => alert(`Öffentlicher QuizRoom "${roomTitle}" ausgewählt`)}
            optionColor="blue"
          />
        </PrimaryContentbox>
      </div>
    </div>
  );
}

export default UserQuizRooms;