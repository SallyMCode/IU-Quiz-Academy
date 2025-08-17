import React, { useEffect, useState } from 'react';
import './CommunityPage.css';
import { Link } from 'react-router-dom';

import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';
import TAGS from '../assets/components/TAGS';

function CommunityPage() {
  // State für die Liste der Threads, Ladezustand, Fehler und neuen Thread-Titel
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // UserID laden
  const userId = localStorage.getItem('userId');

  // Funktion zum Abrufen aller Forum-Threads
  async function fetchThreads() {
    try {
      // API-Aufruf zum Abrufen aller Forum-Threads
      const response = await fetch('/api/forum-threads');
      if (!response.ok) throw new Error('Fehler beim Laden der Threads');

      // JSON-Antwort in State speichern
      const data = await response.json();
      setThreads(data);
    } catch (err) {
      // Fehler im State speichern, um eine Fehlermeldung anzuzeigen
      setError(err.message);
    } finally {
      // Ladezustand beenden, egal ob erfolgreich oder mit Fehler
      setLoading(false);
    }
  }

  // useEffect Hook: Lädt beim ersten Render die Threads vom Backend
  useEffect(() => {
    fetchThreads();
  }, []); // Leeres Abhängigkeitsarray = nur einmal beim Laden ausführen

  // Funktion zum Erstellen eines neuen Threads
  const handleCreateThread = async () => {
    // Validierung: Titel darf nicht leer sein
    if (!newTitle.trim()) return alert('Titel darf nicht leer sein!');
    
    // Zustand setzen, um UI beim Erstellen zu sperren
    setCreating(true);

    try {
      // POST-Request an Backend zum Anlegen eines neuen Threads
      const response = await fetch('/api/forum-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, user_id: userId }), // Daten im Body senden
      });

      if (!response.ok) throw new Error('Fehler beim Erstellen des Threads');

      // Antwort (neuer Thread) ins State setzen und Eingabefeld leeren
      const createdThread = await response.json();
      setThreads([createdThread, ...threads]); // Neuer Thread wird oben hinzugefügt
      await fetchThreads();
      setNewTitle('');
    } catch (err) {
      alert(err.message); // Fehler anzeigen
    } finally {
      // UI entsperren, Button aktivieren
      setCreating(false);
    }
  };

  return (
    <div>
      {/* Navigation und Header */}
      <NavBar />
      <Header />

      <div className="container">
        {/* Suchleiste (noch deaktiviert, als Platzhalter) */}
        <div className="search-bar">
          <input type="text" placeholder="🔍 Forum durchsuchen... (noch nicht implementiert)" disabled />
          {/* Suchfunktion kann später implementiert werden */}
        </div>

        {/* Bereich zum Erstellen eines neuen Threads */}
        <div style={{ margin: '1rem 0' }}>
          <input
            type="text"
            placeholder="Neuen Thread-Titel eingeben..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={creating} // Eingabefeld deaktivieren während Thread erstellt wird
          />
          <button onClick={handleCreateThread} disabled={creating}>
            {/* Button-Text wechselt je nach Status */}
            {creating ? 'Erstelle...' : '+ Neuen Thread erstellen'}
          </button>
        </div>

        {/* Ladeanzeige und Fehleranzeige */}
        {loading && <p>Lade Threads...</p>}
        {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}

        {/* Liste der vorhandenen Threads */}
        <section className="forum-section">
          <h2>🎓 Nutzerforen</h2>

          {/* Falls keine Threads vorhanden und nicht am Laden */}
          {threads.length === 0 && !loading && <p>Keine Threads gefunden.</p>}

          {/* Mapping über die Threads und Anzeigen mit Link auf Thread-Seite */}
          {threads.map(thread => (
            <div key={thread.id} className="forum-thread">
              <h3>
                <Link to={`/community/thread/${thread.id}`}>{thread.title}</Link>
              </h3>
              <div className="meta">
                Erstellt von <TAGS status="Neutral" text={`#${thread.author?.username || 'Unbekannt'}`} /> am{' '}
                {new Date(thread.created_at).toLocaleDateString('de-DE')}
              </div>
            </div>
          ))}
        </section>

        {/* Statischer Admin/FAQ-Bereich, keine Interaktion */}
        <section className="forum-section">
          <h2>🛠️ FAQ & Admin</h2>
          <div className="forum-thread admin-thread">
            <h3>[FAQ] Wie funktioniert das Punktesystem?</h3>
            <p>In diesem Beitrag erklären wir, wie Punkte vergeben werden und was die Erfolgsquote beeinflusst.</p>
            <div className="meta">Admin – Zuletzt aktualisiert am 20. Juni 2025</div>
          </div>

          <div className="forum-thread admin-thread">
            <h3>[Ankündigung] Neue Quizräume im Juli</h3>
            <p>Ab Juli gibt es neue Quizräume für IT-Sicherheit und Data Science!</p>
            <div className="meta">Admin – Veröffentlicht am 18. Juni 2025</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CommunityPage;
