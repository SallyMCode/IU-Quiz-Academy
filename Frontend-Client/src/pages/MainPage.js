import React, { useEffect, useState } from 'react';
import './MainPage.css';

// Import der ausgelagerten Komponenten
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import LearningKPIs from '../assets/components/LearningKPIs';
import QuizroomList from '../assets/components/QuizroomList';
import CommunityBox from '../assets/components/CommunityBox';

function MainPage() {
const [userName, setUserName] = useState(''); // Benutzername
const [lastSession, setLastSession] = useState(null); // Letzte Session-Daten

useEffect(() => {
  // Beispiel: Hole Benutzerdaten vom Backend
  fetch('/api/users/me')
    .then(res => res.json())
    .then(data => {
      setUserName(data.username || ''); // Benutzername setzen
    })
    .catch(err => {
      console.error('Fehler beim Laden des Benutzers:', err);
    });

  // Hole letzte Quiz-Session
  fetch('/api/sessions/last') // Beispiel-Endpunkt für letzte Session
    .then(res => res.json())
    .then(data => {
      setLastSession(data); // z.B. { date: '2025-06-17', topic: 'Datenbanken & SQL' }
    })
    .catch(err => {
      console.error('Fehler beim Laden der letzten Session:', err);
    });
}, []);

// Hilfsfunktion für Datumsformat (optional)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('de-DE', options);
}

return (
  <div>
    <NavBar />
    <Header />

    <div className="container">
      {/* Begrüßung */}
      <div className="greeting">
        <h2>Willkommen zurück, {userName || 'Sally'}!</h2>
        <p>
          Schön, dass du wieder dabei bist. Jeder Schritt bringt dich deinem Ziel näher.
          <br />
          Starte heute ein neues Quiz oder schau dir deine Lernstatistik an.
        </p>
      </div>

      {/* Letzte Session */}
      <div className="last-session">
        <strong>Letzte Quiz-Session:</strong>{' '}
        {lastSession ? (
          <>
            {formatDate(lastSession.date)} – <em>{lastSession.topic}</em>
          </>
        ) : (
          'Keine Daten verfügbar'
        )}
      </div>

      {/* Statistiken */}
      <LearningKPIs />

      {/* Community-Forum-Box */}
      <CommunityBox />
    </div>
  </div>
);
}

export default MainPage;