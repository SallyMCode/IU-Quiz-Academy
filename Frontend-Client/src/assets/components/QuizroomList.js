import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './QuizroomList.css';

function QuizroomList() {
  
  const navigate = useNavigate(); // Hook initialisieren

  
  const subjects = [
    { title: 'Netzwerke & IP', quizzes: ['Netzwerk-Quiz 1', 'IP-Adressierung'] },
    { title: 'Java Grundlagen', quizzes: ['OOP-Konzepte', 'Exception-Handling'] },
    { title: 'Requirements Engineering', quizzes: ['SQL-Joins', 'Normalisierung'] },
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

// Handler-Funktion für den Klick auf "Neues Fach hinzufügen"
const handleAddNewSubject = () => {
  navigate('/NewQuizroom'); // Navigiert zur Route /NewQuizroom
};

const startQuizRoom = () => {
  navigate('/QuizSession'); // Navigiert zur QuizSession
};

  return (
    <section>
      <h2>Meine Quiz-Räume</h2>
      <div className="subjects" onClick={startQuizRoom}>
        {subjects.map((subject, idx) => (
          <div className="subject" key={idx}>
            <h3 className="subject-header">{subject.title}</h3>
            <ul className="room-list">
              {subject.quizzes.map((quiz, i) => (
                <li key={i}>
                  <button className="join">Beitreten</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Füge den onClick-Handler zu dem "Neues Fach hinzufügen"-Element hinzu */}
      <div className="new-subject" onClick={handleAddNewSubject}> {/* <<< HIER IST DIE WICHTIGE ANPASSUNG */}
        + Neuen QuizRoom hinzufügen
      </div>
    </section>
  );

};

export default QuizroomList;
