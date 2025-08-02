import React, { useEffect, useState } from 'react';
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import OptionFieldGroup from '../assets/components/OptionfieldGroup';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import { useNavigate } from 'react-router-dom';
import './UserQuizRooms.css';
import { useHttpClient } from '../assets/hooks/http-hook';

function UserQuizRooms() {
  const [userQuizRooms, setUserQuizRooms] = useState([]);
  const [publicQuizRooms, setPublicQuizRooms] = useState([]);
  const navigate = useNavigate();

  // HTTP-Hook verwenden
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Statische User-ID für Demo
  const userId = 1;

  useEffect(() => {
    async function fetchQuizRooms() {
      try {
        const allRooms = await sendRequest('http://localhost:5000/api/quizrooms');
        // UserQuizRooms: creator.id === userId && public === false
        const myRooms = allRooms.filter(
          room =>
            room.creator &&
            room.creator.id === userId &&
            (room.public === false || room.public === 0)
        );
        setUserQuizRooms(myRooms);

        // PublicQuizRooms: public === true
        const publicRooms = allRooms.filter(room => room.public === true || room.public === 1);
        setPublicQuizRooms(publicRooms);

      } catch (err) {
        setUserQuizRooms([]);
        setPublicQuizRooms([]);
      }
    }
    fetchQuizRooms();
  }, [sendRequest]);

  return (
    <div>
      <NavBar />
      <Header />

      <div className="user-quizrooms-page">
        <PrimaryContentbox mode="newQuiz" customBorder="yellow">
          <div className="quizroom-header-row">
            <h1>🧑‍🏫</h1>
            <h2 className="section-title">Meine Quiz Rooms</h2>
          </div>
          {isLoading ? (
            <div className="spinner">Lade QuizRooms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : userQuizRooms.length === 0 ? (
            <div className="empty-message">Du hast noch keine eigenen QuizRooms.</div>
          ) : (
            <OptionFieldGroup
              options={userQuizRooms}
              onOptionClick={room =>
                navigate('/Quizsession', {
                  state: {
                    quizRoomId: room.id,
                    isPublicQuizRoom: room.public === true || room.public === 1 // <-- Wert mitgeben
                  }
                })
              }
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
          <h2 className="section-title blue-title">🔓Öffentliche Quiz Rooms</h2>
          {isLoading ? (
            <div className="spinner">Lade QuizRooms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : publicQuizRooms.length === 0 ? (
            <div className="empty-message">Keine öffentlichen QuizRooms vorhanden.</div>
          ) : (
            <OptionFieldGroup
              options={publicQuizRooms.map(room => ({ ...room, optionColor: 'blue' }))}
              onOptionClick={room =>
                navigate('/Quizsession', {
                  state: {
                    quizRoomId: room.id,
                    isPublicQuizRoom: true // <-- Wert mitgeben
                  }
                })
              }
            />
          )}
        </PrimaryContentbox>
      </div>
    </div>
  );
}

export default UserQuizRooms;