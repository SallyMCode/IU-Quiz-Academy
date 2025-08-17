import React, { useEffect, useState } from 'react';
import './MainPage.css';
import TAGS from '../assets/components/TAGS';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import der ausgelagerten Komponenten
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import LearningKPIs from '../assets/components/LearningKPIs';
import CommunityBox from '../assets/components/CommunityBox';
//
function MainPage() {
  const [userName, setUserName] = useState('');
  const [lastSession, setLastSession] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [quizRoomMap, setQuizRoomMap] = useState({});
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    // Lade alle QuizRooms und baue ein Mapping quizRoomId -> title
    axios.get('/api/quizrooms')
      .then(res => {
        const map = {};
        res.data.forEach(room => {
          map[room.id] = room.title;
        });
        setQuizRoomMap(map);
      });

    // Lade Userdaten
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.username || '');
      })
      .catch(err => {
        console.error('Fehler beim Laden des Benutzers:', err);
      });

    // Lade letzte Session
    fetch(`/api/sessions/last?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setLastSession(data);
      })
      .catch(err => {
        console.error('Fehler beim Laden der letzten Session:', err);
      });

    // Lade alle Sessions des Users
    axios.get(`/api/quizsessions/userroom?userId=${userId}`)
      .then(res => setUserSessions(res.data))
      .catch(() => setUserSessions([]));
  }, [userId]);

  const handleResumeSession = (session) => {
    navigate('/Quizsession', {
      state: {
        sessionId: session.id,
        quizRoomId: session.quizRoomId,
        isPublicQuizRoom: session.public,
        resume: true,
        currentQuestion: session.currentQuestion,
        score: session.score
      }
    });
  };

  return (
    <div>
      <NavBar />
      <Header />
      <div className="container">
        {/* Begrüßung */}
        <div className="greeting">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            Welcome Back
            <TAGS status="High" text={`#${userName || 'LogedInUser'}`} />
          </h1>
          <p>
            Schön, dass du wieder dabei bist. Jeder Schritt bringt dich deinem Ziel näher.
            <br />
            Starte heute ein neues Quiz oder schau dir deine Lernstatistik an.
          </p>
        </div>

        {/* Letzte Session & letzte Sessions Tabelle */}
        <div className="last-session">


          {/* Tabelle der letzten Quiz Sessions */}
          <div>
            <h3 style={{ marginBottom: 4, textAlign: 'center' }}>🏆Meine letzten Quiz Sessions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>QuizRoom</th>
                  <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: 6, textDecoration: 'underline' }}>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {userSessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center',padding: 6, color: '#888' }}>Keine Sessions gefunden.</td>
                  </tr>
                ) : (
                  userSessions.map(session => (
                    <tr key={session.id}>
                      <td style={{ padding: 6 }}>
                        <TAGS
                          status={session.public ? 'Neutral' : 'High'}
                          text={quizRoomMap[session.quizRoomId] || 'Unbekannt'}
                        />
                      </td>
                      <td style={{ padding: 6, textAlign: 'center', fontWeight: 'bold' }}>
                        {session.score}
                      </td>
                      <td style={{ padding: 6, textAlign: 'center', fontWeight: 'bold' }}>
                        {session.state === 'CLOSED'
                          ? 'Abgeschlossen'
                          : session.state === 'IN_PROGRESS'
                          ? 'Am Quizzen'
                          : session.state}
                      </td>
                      <td style={{ padding: 6 }}>
                        {session.state === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleResumeSession(session)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: 6,
                              background: session.public ? '#2563EB' : '#ffc107', // Blau für true, Gelb für false
                              color: session.public ? '#fff' : '#333',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Fortsetzen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistiken */}
        <LearningKPIs userId={userId} />

        {/* Community-Forum-Box */}
        <CommunityBox />
      </div>
    </div>
  );
}

export default MainPage;