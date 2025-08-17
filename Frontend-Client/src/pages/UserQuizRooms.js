import React, { useEffect, useState } from 'react';
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import OptionFieldGroup from '../assets/components/OptionfieldGroup';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import { useNavigate } from 'react-router-dom';
import './UserQuizRooms.css';
import { useHttpClient } from '../assets/hooks/http-hook';
import TAGS from '../assets/components/TAGS';
import axios from 'axios';

function UserQuizRooms() {
  const [userQuizRooms, setUserQuizRooms] = useState([]);
  const [publicQuizRooms, setPublicQuizRooms] = useState([]);
  const [sessionsByRoom, setSessionsByRoom] = useState({});
  const navigate = useNavigate();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchQuizRooms() {
      try {
        const allRooms = await sendRequest('http://localhost:5000/api/quizrooms');
        const myRooms = allRooms.filter(
          room =>
            room.creator &&
            room.creator.id === parseInt(userId, 10) && 
            (room.public === false || room.public === 0)
        );
        setUserQuizRooms(myRooms);

        const publicRooms = allRooms.filter(room => room.public === true || room.public === 1);
        setPublicQuizRooms(publicRooms);

      } catch (err) {
        setUserQuizRooms([]);
        setPublicQuizRooms([]);
      }
    }
    fetchQuizRooms();
  }, [sendRequest, userId]);

  // Lade für jeden PublicQuizRoom die Sessions der letzten 24h
  useEffect(() => {
    if (!publicQuizRooms.length) return;
    const now = new Date();
    const fetchAllSessions = async () => {
      const sessionsObj = {};
      await Promise.all(
        publicQuizRooms.map(async (room) => {
          try {
            const res = await axios.get(`/api/quizsessions/userroom?quizRoomId=${room.id}`);
            // Filter auf die letzten 24h
            const filtered = res.data.filter(session => {
              const lastAction = new Date(session.lastAction);
              return (now - lastAction) <= 24 * 60 * 60 * 1000;
            });
            sessionsObj[room.id] = filtered;
          } catch {
            sessionsObj[room.id] = [];
          }
        })
      );
      setSessionsByRoom(sessionsObj);
    };
    fetchAllSessions();
  }, [publicQuizRooms]);

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
                    userId,
                    isPublicQuizRoom: room.public === true || room.public === 1 
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
            <>
              <OptionFieldGroup
                options={publicQuizRooms.map(room => ({ ...room, optionColor: 'blue' }))}
                onOptionClick={room =>
                  navigate('/Quizsession', {
                    state: {
                      quizRoomId: room.id,
                      userId,
                      isPublicQuizRoom: true
                    }
                  })
                }
              />
              <div style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 4 }}>Letzte Quiz Sessions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Username</th>
                      <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>QuizRoom</th>
                      <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Status</th>
                      <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicQuizRooms.every(room => (sessionsByRoom[room.id] || []).length === 0) ? (
                      <tr>
                        <td colSpan={4} style={{ padding: 6, color: '#888' }}>Keine Aktivität in den letzten 24h.</td>
                      </tr>
                    ) : (
                      publicQuizRooms.flatMap(room =>
                        (sessionsByRoom[room.id] || []).map(session => (
                          <tr key={session.id + '-' + room.id}>
                            <td style={{ padding: 6 }}>
                              <TAGS status="Neutral" text={'#' + (session.user?.username || 'Unbekannt')} />
                            </td>
                            <td style={{ padding: 6 }}>{room.title}</td>
                            <td style={{ padding: 6 }}>
                              {session.state === 'CLOSED'
                                ? 'Abgeschlossen'
                                : session.state === 'IN_PROGRESS'
                                ? 'Am Quizzen'
                                : session.state}
                            </td>
                            <td style={{ padding: 6 }}>{session.score}</td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </PrimaryContentbox>
      </div>
    </div>
  );
}

export default UserQuizRooms;