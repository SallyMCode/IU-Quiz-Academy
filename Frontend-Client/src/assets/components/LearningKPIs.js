import React, { useEffect, useState } from 'react';
import './LearningKPIs.css';

function LearningKPIs() {
const [stats, setStats] = useState({
  totalQuizzes: 0,
  successRate: 0,
  totalPoints: 0,
});

useEffect(() => {
  async function fetchStats() {
    try {
      const response = await fetch('http://localhost:3000/api/statistics'); // ggf. Port anpassen
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Lernstatistiken:', error);
    }
  }

  fetchStats();
}, []);

return (
  <section>
    <h2>Lernstatistiken</h2>
    <div className="stats">
      <div className="stat-card">
        <h3>Absolvierte Quizze</h3>
        <p>{stats.totalQuizzes}</p>
      </div>
      <div className="stat-card">
        <h3>Erfolgsquote</h3>
        <p>{stats.successRate} %</p>
      </div>
      <div className="stat-card">
        <h3>Punkte insgesamt</h3>
        <p>{stats.totalPoints}</p>
      </div>
    </div>
  </section>
);
}

export default LearningKPIs;