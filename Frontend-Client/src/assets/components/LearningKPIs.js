import React, { useEffect, useState } from 'react';
import './LearningKPIs.css';

function LearningKPIs({ userId }) {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    successRate: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    if (!userId) return;
    async function fetchStats() {
      try {
        const response = await fetch(`http://localhost:3000/api/statistics?userId=${userId}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Lernstatistiken:', error);
      }
    }

    fetchStats();
  }, [userId]);

  return (
    <section>
      <h2>Lernstatistiken</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>🕹️Quiz Sessions</h3>
          <p>{stats.totalQuizzes}</p>
        </div>
        <div className="stat-card">
          <h3>🏆Erfolgsquote</h3>
          <p>{stats.successRate} %</p>
        </div>
        <div className="stat-card">
          <h3>🎯Punkte gesamt</h3>
          <p>{stats.totalPoints}</p>
        </div>
      </div>
    </section>
  );
}

export default LearningKPIs;