import React from 'react';
import './CommunityPage.css';

import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';

function CommunityPage() {
  return (
    <div>
      <NavBar />
      <Header />

      <div className="container">
        {/* Suchleiste */}
        <div className="search-bar">
          <input type="text" placeholder="🔍 Forum durchsuchen..." />
        </div>

        {/* Nutzer-Forum */}
        <section className="forum-section">
          <h2>🎓 Nutzerforen</h2>
          <a href="#" className="new-thread-btn">+ Neuen Thread erstellen</a>

          <div className="forum-thread">
            <h3>Wie bereitet ihr euch auf SQL-Klausuren vor?</h3>
            <p>Ich suche nach Tipps, wie man effizient für SQL-Fragen lernen kann. Habt ihr gute Methoden?</p>
            <div className="meta">Erstellt von <strong>LukasM</strong> am 24. Juni 2025 – 8 Antworten</div>
          </div>

          <div className="forum-thread">
            <h3>Java – Verständnisprobleme bei Vererbung</h3>
            <p>Kann mir jemand erklären, wann genau man <code>super()</code> verwenden sollte und wann nicht?</p>
            <div className="meta">Erstellt von <strong>AnnaS</strong> am 23. Juni 2025 – 5 Antworten</div>
          </div>

          <div className="forum-thread">
            <h3>Empfehlungen für Lernvideos?</h3>
            <p>Welche YouTube-Kanäle oder Online-Kurse nutzt ihr für die IUBH-Klausurvorbereitung?</p>
            <div className="meta">Erstellt von <strong>BenP</strong> am 21. Juni 2025 – 12 Antworten</div>
          </div>
        </section>

        {/* Admin/FAQ-Bereich */}
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