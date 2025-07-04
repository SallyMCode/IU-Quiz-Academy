import React, { useState, useContext, useEffect } from 'react';
import './MainPage.css'; // Import der ausgelagerten CSS-Datei

function MainPage() {
  // Effekt-Hook für das Ein-/Ausklappen der Quizlisten
useEffect(() => {
  const headers = document.querySelectorAll('.subject-header');
  function toggleList(event) {
    const list = event.currentTarget.nextElementSibling;
    if (!list) return;
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  }
  headers.forEach(header => header.addEventListener('click', toggleList));
  return () => {
    headers.forEach(header => header.removeEventListener('click', toggleList));
  };
}, []);

  return (
    <div>
      {/* Navigationsleiste */}
      <nav>
        <div className="nav-left">
          <img src="/logoQuizAcademypng.png" alt="Logo" />
          <div className="logo">IU-Quiz-Academy</div>
        </div>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Quizräume</a></li>
          <li><a href="#">Statistiken</a></li>
          <li><a href="#">Forum</a></li>
          <li><a href="#">Logout</a></li>
        </ul>
      </nav>

      {/* Header mit Hintergrundbild */}
      <header>
        <h1>IU-Quiz-Academy – Dein Lernbereich</h1>
      </header>

      <div className="container">
        {/* Begrüßung */}
        <div className="greeting">
          <h2>Willkommen zurück, Sally!</h2>
          <p>Schön, dass du wieder dabei bist. Jeder Schritt bringt dich deinem Ziel näher.<br />
          Starte heute ein neues Quiz oder schau dir deine Lernstatistik an.</p>
        </div>

        {/* Letzte Session */}
        <div className="last-session">
          <strong>Letzte Quiz-Session:</strong> Montag, 17. Juni 2025 – <em>Datenbanken & SQL</em>
        </div>

        {/* Statistiken */}
        <section>
          <h2>Lernstatistiken</h2>
          <div className="stats">
            <div className="stat-card">
              <h3>Absolvierte Quizze</h3>
              <p>12</p>
            </div>
            <div className="stat-card">
              <h3>Erfolgsquote</h3>
              <p>87 %</p>
            </div>
            <div className="stat-card">
              <h3>Punkte insgesamt</h3>
              <p>4 350</p>
            </div>
          </div>
        </section>

        {/* Eigene Quizräume */}
        <section>
          <h2>Meine Quiz-Räume</h2>
          <div className="subjects">
            {[
              {
                title: 'Netzwerke & IP',
                quizzes: ['Netzwerk-Quiz 1', 'IP-Adressierung']
              },
              {
                title: 'Java Grundlagen',
                quizzes: ['OOP-Konzepte', 'Exception-Handling']
              },
              {
                title: 'Datenbanken & SQL',
                quizzes: ['SQL-Joins', 'Normalisierung']
              }
            ].map((subject, idx) => (
              <div className="subject" key={idx}>
                <div className="subject-header">
                  <h3>{subject.title}</h3>
                </div>
                <ul className="room-list">
                  {subject.quizzes.map((quiz, i) => (
                    <li key={i}>{quiz} <button className="join">Beitreten</button></li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="new-subject">+ Neues Fach hinzufügen</div>
          </div>
        </section>

        {/* Öffentliche Räume */}
        <section className="public-quizzes">
          <h2>Öffentliche Quizräume</h2>
          <p>Du willst dich mit anderen Studierenden messen? Trete einem öffentlichen Raum bei und stelle dein Wissen unter Beweis!</p>
          <ul>
            <li>🌐 Allgemeinwissen – <button className="join">Mitspielen</button></li>
            <li>🌐 Wirtschaftsmathe – <button className="join">Mitspielen</button></li>
            <li>🌐 Prüfungsfragen Mix – <button className="join">Mitspielen</button></li>
          </ul>
        </section>

        {/* Community-Forum-Box */}
        <section className="community">
          <h2>Community & Forum</h2>
          <p>Diskutiere mit anderen Studierenden oder hole dir Tipps.</p>
          <a href="#">Zum User-Forum</a>
        </section>
      </div>
    </div>
  );
}

export default MainPage;