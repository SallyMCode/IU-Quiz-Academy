import React, { useEffect } from 'react';
import './QuizroomList.css';

function QuizroomList() {
  const subjects = [
    { title: 'Netzwerke & IP', quizzes: ['Netzwerk-Quiz 1', 'IP-Adressierung'] },
    { title: 'Java Grundlagen', quizzes: ['OOP-Konzepte', 'Exception-Handling'] },
    { title: 'Datenbanken & SQL', quizzes: ['SQL-Joins', 'Normalisierung'] },
  ];

  useEffect(() => {
    const headers = document.querySelectorAll('.subject-header');
    function toggleList(e) {
      const list = e.currentTarget.nextElementSibling;
      if (list) {
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
      }
    }
    headers.forEach(header => header.addEventListener('click', toggleList));
    return () => headers.forEach(header => header.removeEventListener('click', toggleList));
  }, []);

  return (
    <section>
      <h2>Meine Quiz-Räume</h2>
      <div className="subjects">
        {subjects.map((subject, idx) => (
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
  );
}

export default QuizroomList;
