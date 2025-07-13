import React from 'react';
import './SecondaryContentbox.css';

const SecondaryContentBox = ({ questionNumber, data, quizTitle }) => {
  return (
    <div className="content-box secondary-content-box">
        <div className="secondary-content-box .quiz-title"> <strong>{quizTitle}</strong></div>
      {/* Die Fragen-Nummer, wie im Screenshot gezeigt */}
      <div className="readonly-field">
        <strong>{questionNumber}</strong>
      </div>
      
      {/* Weitere Read-only Felder */}
      <div className="readonly-field">
        <strong>Punkte gesamt:</strong> {data.totalPoints}
      </div>
      {/* ... weitere Read-only Felder hier einfügen */}
    </div>
  );
};
export default SecondaryContentBox;