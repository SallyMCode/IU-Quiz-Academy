import React from 'react';
import './PrimaryContentbox.css';
import OptionFieldGroup from './OptionfieldGroup';
import ButtonGroup from './ButtonGroup';
import quizLogo from '../images/QuizAcademylogoBLANK.png';

const PrimaryContentbox = ({
  mode,
  questionNumber,
  questionText,
  options,
  buttons,
  onOptionClick,
  mainMessage,
  subMessage,
  children,
  customBorder
}) => {

  // Bedingtes Rendering basierend auf dem 'mode'
  const renderContent = () => {
    if (mode === 'quiz') {
      return (
        <>
          <p className="question-number-top">{questionNumber}</p>
          <p className="question-text">{questionText}</p>
          <OptionFieldGroup
            options={options}
            onOptionClick={onOptionClick}
          />
          <ButtonGroup buttons={buttons} />
        </>
      );
    } else if (mode === 'publicquiz') {
      return (
        <>
          <p className="question-number-top">{questionNumber}</p>
          <p className="question-text">{questionText}</p>
          <OptionFieldGroup
            options={options}
            onOptionClick={onOptionClick}
          />
          <ButtonGroup buttons={buttons} />
        </>
      );
    } else if (mode === 'result') {
      return (
        <>
          <h2 className="main-message">{mainMessage}</h2>
          <p className="sub-message">{subMessage}</p>
          <img src={quizLogo} alt="IU Quiz Academy Logo" className="quiz-logo-large" />
          <ButtonGroup buttons={buttons} />
        </>
      );
    } else if (mode === 'newQuiz') {
      return (<>{children}</>);
    }
    // Optional: Fallback für unbekannte Modi
    return <p>Kein gültiger Anzeigemodus für PrimaryContentBox.</p>;
  };

  return (
    <div
      className={`content-box primary-content-box ${customBorder === 'blue' ? 'border-blue' : customBorder === 'yellow' ? 'border-yellow' : ''}`}
    >
      {renderContent()}
    </div>
  );
};

export default PrimaryContentbox;



