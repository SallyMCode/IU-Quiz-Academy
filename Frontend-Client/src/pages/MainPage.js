import React, { useEffect, useState } from 'react';
import './MainPage.css';

// Import der ausgelagerten Komponenten
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import LearningKPIs from '../assets/components/LearningKPIs';
import CommunityBox from '../assets/components/CommunityBox';
import Tags from '../assets/components/TAGS';
//
function MainPage() {
const [userName, setUserName] = useState(''); // Benutzername
const [lastSession, setLastSession] = useState(null); // Letzte Session-Daten
const userId = localStorage.getItem('userId'); // User-ID aus dem LocalStorage holen


useEffect(() => {
  
  if (!userId) return;

  // Beispiel: Hole Benutzerdaten vom Backend
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      setUserName(data.username || '');
    })
    .catch(err => {
      console.error('Fehler beim Laden des Benutzers:', err);
    });

  // Hole letzte Quiz-Session für den User
  fetch(`/api/sessions/last?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      setLastSession(data);
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
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          Welcome Back
          <Tags status="High" text={`#${userName || 'LogedInUser'}`} />
        </h1>
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
      <LearningKPIs userId={userId} />

      {/* Community-Forum-Box */}
      <CommunityBox />

      {/* Tags-Komponente */}
      <Tags />
    </div>
  </div>
);
}

export default MainPage;