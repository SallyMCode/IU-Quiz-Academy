import React from 'react';
import './PrimaryContentbox.css';
import OptionFieldGroup from './OptionfieldGroup'; // Wird nur im 'quiz' Modus benötigt
import ButtonGroup from './ButtonGroup';
import quizLogo from '../images/QuizAcademylogoBLANK.png';

// Die PrimaryContentBox empfängt nun eine 'mode' Prop und spezifische Daten basierend auf dem Modus
const PrimaryContentbox = ({ mode, questionNumber, questionText, options, buttons, onOptionClick, mainMessage, subMessage, children, customBorder }) => {

  // Bedingtes Rendering basierend auf dem 'mode'
  const renderContent = () => {
    if (mode === 'quiz' || mode === 'publicquiz') {
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
    }

    else if (mode === 'newQuiz') {
      return (<>
        {children} {/* Hier werden die Kinder-Elemente (Inputfelder, Buttons) gerendert */}
      </>
      );
    }
      // Optional: Fallback für unbekannte Modi
      return <p>Kein gültiger Anzeigemodus für PrimaryContentBox.</p>;
    };

    return (
      <div
        className="content-box primary-content-box"
        customborder={customBorder}
      >
        {renderContent()}
      </div>
    );
  };

  export default PrimaryContentbox;






// const PrimaryContentBox = ({ quizTitle, questionNumber, questionText, options, onOptionClick,buttons,mainmessage }) => {
// return (
//   <>
//     <div className="content-box primary-content-box">
//       {/* Überschriften-Bereich der Hauptbox */}
//       <h2 className="quiz-title">{quizTitle}</h2>
//       <p className="question-number-top">{questionNumber}</p>

//       {/* Fragetext */}
//       <p className="question-text">{questionText}</p>

//       {/* Optionen als eigene Komponente */}
//       <OptionFieldGroup options={options} onOptionClick={onOptionClick} />
//       <ButtonGroup buttons={buttons} />
//     </div>
//   </>
// );
// };

// export default PrimaryContentBox;