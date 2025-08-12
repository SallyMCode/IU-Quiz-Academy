import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuizAcademyLogo from '../assets/images/QuizAcademylogoBLANK.png'; // Importiere das Logo
import './LoginPage.css';

function LoginPage() {
// States zur Verwaltung der Eingaben und Fehlermeldung
const [username, setUsername] = useState(''); // Benutzername aus dem Eingabefeld
const [password, setPassword] = useState(''); // Passwort aus dem Eingabefeld
const [errorMsg, setErrorMsg] = useState(''); // Fehlermeldung bei Login-Problemen

// Hook für Navigation (Weiterleitung nach erfolgreichem Login)
const navigate = useNavigate();

// Event-Handler für das Absenden des Login-Formulars
const handleLogin = async (e) => {
  e.preventDefault(); // Verhindert das automatische Neuladen der Seite beim Formular-Submit
  setErrorMsg(''); // Vor dem neuen Versuch die Fehlermeldung löschen

  try {
    // Anfrage an das Backend senden (Login-API)
    const response = await fetch('/api/users/login', {
      method: 'POST', // POST, da wir Daten (username + password) senden
      headers: { 'Content-Type': 'application/json' }, // JSON-Daten werden geschickt
      body: JSON.stringify({ username, password }), // Benutzerdaten in JSON umwandeln
    });

    // Überprüfen, ob de Antwort erfolgreich war (Status 200-299)
    if (!response.ok) {
      // Wenn nicht erfolgreich, Fehlermeldung aus der Antwort auslesen
      const errorData = await response.json();
      setErrorMsg(errorData.error || 'Login fehlgeschlagen'); // Fehlermeldung anzeigen
      return; // Funktion beenden, kein weiterverarbeiten
    }

    // Erfolgreiche Antwort: Token und Username aus JSON auslesen
    const data = await response.json();

    // Token und Username lokal speichern (z.B. für weitere API-Anfragen)
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username); // <--- user.username!
    localStorage.setItem('userId', data.user.id);         // <--- user.id speichern

    // Nach erfolgreichem Login zur MainPage / Dashboard weiterleiten
    navigate('/dashboard');
  } catch (error) {
    // Fehler bei der Netzwerkkommunikation (z.B. Server nicht erreichbar)
    setErrorMsg('Netzwerkfehler');
    console.error(error); // Fehler in der Konsole ausgeben
  }
};

return (
  <div className="login-page">
    <div className="login-box">
      {/* Logo der Quiz-Academy */}
      <img src={QuizAcademyLogo} alt="IU-Quiz-Academy Logo" />

      {/* Überschrift */}
      <h1>Login </h1>

      {/* kurze Anleitung */}
      <p>
        Gib deinen <strong>Benutzernamen</strong> und dein Passwort ein, um fortzufahren.
      </p>

      {/* Login-Formular */}
      <form onSubmit={handleLogin}>
        {/* Eingabefeld für Benutzernamen */}
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // State updaten bei Eingabe
          required // Pflichtfeld
        />
        {/* Eingabefeld für Passwort */}
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // State updaten bei Eingabe
          required // Pflichtfeld
        />
        {/* Submit-Button */}
        <button type="submit">Einloggen</button>
      </form>

      {/* Anzeige einer Fehlermeldung, falls vorhanden */}
      {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}

    </div>
  </div>
);
}

export default LoginPage;
