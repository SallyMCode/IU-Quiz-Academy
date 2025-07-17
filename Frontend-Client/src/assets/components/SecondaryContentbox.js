import React from 'react';
import './SecondaryContentbox.css';
import checkIcon from '../images/Check_icon.svg.png';
import ButtonGroup from './ButtonGroup';
import thinkingIcon from '../images/thinking.png';


// Die SecondaryContentBox empfängt nun eine 'mode' Prop und spezifische Daten
const SecondaryContentBox = ({
    mode,
    quizRoom, // Für Quiz-Modus + Result-Modus
    questionNumber, // Für Quiz-Modus
    data, // Für Quiz-Modus (enthält totalPoints, timeRemaining, difficulty)
    currentScore, // Für Result-Modus
    lastScore, // Für Result-Modus
    bestScore, // Für Result-Modus
    worstScore, // Für Result-Modus
    questionNumberDisplay, // Neu für newQuiz Modus
    questionText,          // Neu für newQuiz Modus
    answers,               // Neu für newQuiz Modus
    correctAnswerIndex,    // Neu für newQuiz Modus
    buttonsData,           // Neu für newQuiz Modus (für Bearbeiten/Löschen Buttons)
    children               // Für emptyList Modus
}) => {

    const renderContent = () => {
        if (mode === 'quiz') {
            return (
                <>
                    <span style={{ color: '#ffc107' }}>
                        <h4 className="quiz-room-title">{quizRoom}</h4> </span>
                    <div className="quiz-info-label">
                        {questionNumber}
                    </div>
                    <br />
                    <div className="quiz-info-item">
                        <span className="quiz-info-label">Aktuelle Punkte: </span>
                        <span className="quiz-info-value">{data.totalPoints}</span>
                    </div>
                    <br />
                    <img src={thinkingIcon} alt="SmilyThinking" className="image-secondaryContentbox" />
                </>
            );
        } else if (mode === 'result') {
            return (
                <>

                    <span style={{ color: '#ffc107' }}>
                        <h3 className="quiz-room-title">{quizRoom}</h3> </span>

                    <p className="score-display">Dein Score<br />{currentScore}</p>

                    <div>
                        <div className="score-field">
                            <strong>Dein letzter Score:</strong>{lastScore}
                        </div>
                        <div className="score-field">
                            <strong>Bester Score:</strong> {bestScore}
                        </div>
                        <div className="score-field">
                            <strong>Schlechtester Score:</strong> {worstScore}
                        </div>
                    </div>
                    <img src={checkIcon} alt="CheckSymbol" className="image-secondaryContentbox" />
                </>
            );
        } else if (mode === 'newQuiz') { // <-- NEUER MODUS FÜR FRAGENDETAILS
            return (
                <>
                    <p className="question-number-display" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                        {questionNumberDisplay}
                    </p>
                    <p className="question-detail-text">{questionText}</p>
                    <ul className="answer-list">
                        {answers.map((answer, index) => (
                            <li
                                key={index}
                                className={`answer-item ${index === correctAnswerIndex ? 'correct-answer' : ''}`}
                            >
                                {answer}
                            </li>
                        ))}
                    </ul>
                    <ButtonGroup buttons={buttonsData} />
                </>
            );
        } else if (mode === 'emptyList') { // <-- NEUER MODUS FÜR LEERE LISTE
            return (
                <>
                    {children} {/* Zeigt den "Noch keine Fragen hinzugefügt"-Text */}
                </>
            );


        }
        return <p>Kein gültiger Anzeigemodus für SecondaryContentBox.</p>;
    };

    return (
        <div className="content-box secondary-content-box">
            {renderContent()}
        </div>
    );
};

export default SecondaryContentBox;