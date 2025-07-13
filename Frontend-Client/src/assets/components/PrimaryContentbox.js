import React from 'react';
import './PrimaryContentbox.css';
import OptionFieldGroup from './OptionfieldGroup';
import ButtonGroup from './ButtonGroup';

const PrimaryContentBox = ({ quizTitle, questionNumber, questionText, options, onOptionClick,buttons }) => {
return (
  <>
    <div className="content-box primary-content-box">
      {/* Überschriften-Bereich der Hauptbox */}
      <h2 className="quiz-title">{quizTitle}</h2>
      <p className="question-number-top">{questionNumber}</p>

      {/* Fragetext */}
      <p className="question-text">{questionText}</p>

      {/* Optionen als eigene Komponente */}
      <OptionFieldGroup options={options} onOptionClick={onOptionClick} />
      <ButtonGroup buttons={buttons} />
    </div>
  </>
);
};

export default PrimaryContentBox;