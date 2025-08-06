import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook, um URL-Parameter zu lesen (z.B. threadId)
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';

function ThreadPage() {
// Lese die Thread-ID aus der URL (z.B. /community/thread/:threadId)
const { threadId } = useParams();

// State zum Speichern der Posts im Thread
const [posts, setPosts] = useState([]);
// State für die Thread-Metadaten (Titel etc.)
const [thread, setThread] = useState(null);
// Ladezustand während Daten geladen werden
const [loading, setLoading] = useState(true);
// Fehlernachricht im Fehlerfall
const [error, setError] = useState(null);
// Inhalt für neuen Post im Eingabefeld
const [newPostContent, setNewPostContent] = useState('');
// Status ob gerade ein neuer Post abgesendet wird
const [posting, setPosting] = useState(false);

// UserID Laden
const userId = localStorage.getItem('userId');

// useEffect lädt Thread-Infos und Posts, wenn sich die Thread-ID ändert
useEffect(() => {
async function fetchThreadAndPosts() {
  try {
    setLoading(true); // Ladezustand aktivieren

    // API-Aufruf, um Thread-Details zu laden
    const threadRes = await fetch(`/api/forum-threads/${threadId}`);
    if (!threadRes.ok) throw new Error('Thread nicht gefunden');
    const threadData = await threadRes.json();
    setThread(threadData); // Thread-Daten speichern

    // API-Aufruf, um Posts zum Thread zu laden
    const postsRes = await fetch(`/api/forum-posts/${threadId}`);
    if (!postsRes.ok) throw new Error('Fehler beim Laden der Posts');
    const postsData = await postsRes.json();
    setPosts(postsData); // Posts speichern
  } catch (err) {
    setError(err.message); // Fehler speichern für Anzeige
  } finally {
    setLoading(false); // Ladezustand deaktivieren
  }
}

fetchThreadAndPosts();
}, [threadId]); // Nur neu ausführen, wenn sich threadId ändert

// Funktion zum Absenden eines neuen Posts
const handlePostSubmit = async () => {
// Eingabe validieren (nicht nur Leerzeichen)
if (!newPostContent.trim()) return alert('Bitte Inhalt eingeben.');

setPosting(true); // Disable Button/Eingabe während Absenden

try {
  // POST-Request an API zum Erstellen eines neuen Posts
  const res = await fetch('/api/forum-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread_id: threadId, user_id: userId, content: newPostContent }),
  });
  if (!res.ok) throw new Error('Fehler beim Erstellen des Posts');

  // Neuer Post aus Antwort lesen
  const createdPost = await res.json();
  // Neuer Post wird ans Ende der Posts angehängt
  setPosts([...posts, createdPost]);
  setNewPostContent(''); // Eingabefeld leeren
} catch (err) {
  alert(err.message); // Fehler anzeigen
} finally {
  setPosting(false); // UI wieder aktivieren
}
};

// Ladeanzeige, wenn Daten noch nicht da sind
if (loading) return <p>Lade Thread...</p>;

// Fehleranzeige bei Problemen
if (error) return <p style={{ color: 'red' }}>Fehler: {error}</p>;

return (
<div>
  {/* Navigations- und Header-Komponenten */}
  <NavBar />
  <Header />

  <div className="thread-container">
    {/* Thread-Titel anzeigen */}
    <h2 className="thread-title">{thread.title}</h2>

    {/* Falls noch keine Beiträge vorhanden sind */}
    {posts.length === 0 && <p>Keine Beiträge vorhanden.</p>}

    {/* Beiträge mapen und anzeigen */}
    {posts.map((post) => (
      <div key={post.id} className="forum-post">
        <div>
          <strong>{post.author?.username || 'Unbekannt'}</strong> schrieb:
        </div>
        <p>{post.content}</p>
        {/* Datum formatiert anzeigen */}
        <small>{new Date(post.created_at).toLocaleString('de-DE')}</small>
      </div>
    ))}

    {/* Formular zum Verfassen eines neuen Beitrags */}
    <div className="post-form">
      <h4>✏️ Neuen Beitrag verfassen</h4>
      <textarea
        rows="4"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        disabled={posting} // Deaktiviert während Absenden
        placeholder="Was möchtest du sagen?"
      />
      <button onClick={handlePostSubmit} disabled={posting}>
        {posting ? 'Sende...' : 'Beitrag absenden'}
      </button>
    </div>
  </div>
</div>
);
}

export default ThreadPage;
