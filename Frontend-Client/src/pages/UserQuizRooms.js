import React, { useEffect, useState } from 'react';
import PrimaryContentbox from '../assets/components/PrimaryContentbox';
import OptionFieldGroup from '../assets/components/OptionfieldGroup';
import './UserQuizRooms.css';

const STATIC_PUBLIC_QUIZROOMS = [
  'Allgemeinwissen',
  'Mathematik für IT',
  'Englisch Basics',
  'Projektmanagement',
];

function UserQuizRooms() {
  const [userQuizRooms, setUserQuizRooms] = useState([]);
  const [error, setError] = useState(null);

  // Statische User-ID für Demo
  const userId = 1;

  useEffect(() => {
    async function fetchUserQuizRooms() {
      try {
        setError(null);
        // Beispiel-API-Call, passe ggf. den Endpoint an!
        const response = await fetch('http://localhost:5000/api/quizrooms');
        if (!response.ok) throw new Error('QuizRooms konnten nicht geladen werden');
        const allRooms = await response.json();
        // Filter nach creator_id === userId
        const myRooms = allRooms.filter(room => room.creator_id === userId);
        setUserQuizRooms(myRooms);
      } catch (err) {
        setError(err.message);
        setUserQuizRooms([]);
      }
    }
    fetchUserQuizRooms();
  }, []);

  return (
    <div className="user-quizrooms-page">
      <PrimaryContentbox mode="newQuiz" customBorder="yellow">
        <h2 className="section-title">Meine Quiz-Räume</h2>
        {error && <div className="error-message">{error}</div>}
        {userQuizRooms.length === 0 && !error && (
          <div className="empty-message">Du hast noch keine eigenen QuizRooms.</div>
        )}
        {userQuizRooms.length > 0 && (
          <OptionFieldGroup
            options={userQuizRooms.map(room => room.title)}
            onOptionClick={roomTitle => alert(`QuizRoom "${roomTitle}" ausgewählt`)}
          />
        )}
      </PrimaryContentbox>

      <PrimaryContentbox mode="newQuiz" customBorder="blue">
        <h2 className="section-title">Öffentliche Quizräume</h2>
        <OptionFieldGroup
          options={STATIC_PUBLIC_QUIZROOMS}
          onOptionClick={roomTitle => alert(`Öffentlicher QuizRoom "${roomTitle}" ausgewählt`)}
        />
      </PrimaryContentbox>
    </div>
  );
}

export default UserQuizRooms;