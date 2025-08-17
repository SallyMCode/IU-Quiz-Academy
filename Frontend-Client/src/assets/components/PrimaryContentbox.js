import React from 'react';
import './PrimaryContentbox.css';
import OptionFieldGroup from './OptionfieldGroup';
import ButtonGroup from './ButtonGroup';
import quizLogo from '../images/QuizAcademylogoBLANK.png';
import QuizFinished from '../images/QuizFinished.png';

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
  customBorder,
  // Props für Result-Content
  currentScoreTag,
  bestScoreTag,
  worstScoreTag,
  showResultContent,
  quizFinishedImage
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
          {showResultContent ? (
            <>
              <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                {currentScoreTag}
                {bestScoreTag}
                {worstScoreTag}
              </div>
              <img
                src={quizFinishedImage || QuizFinished}
                alt="Feedback"
                style={{ maxWidth: 320, width: '100%', height: 'auto', marginBottom: 32 }}
              />
            </>
          ) : (
            <img src={quizLogo} alt="IU Quiz Academy Logo" className="quiz-logo-large" />
          )}
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {renderContent()}
    </div>
  );
};

export default PrimaryContentbox;



