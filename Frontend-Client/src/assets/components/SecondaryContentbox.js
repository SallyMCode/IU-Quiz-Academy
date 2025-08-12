import React from 'react';
import './SecondaryContentbox.css';
import checkIcon from '../images/Check_icon.svg.png';
import ButtonGroup from './ButtonGroup';
import thinkingIcon from '../images/thinking.png';
import thumbsUPIcon from '../images/thumbsUP.png';
import wrongIcon from '../images/Wrong.png';
import TAGS from './TAGS';

// Die SecondaryContentBox empfängt nun eine 'mode' Prop und spezifische Daten
const SecondaryContentBox = ({
    mode,
    quizRoom,
    questionNumber,
    data,
    currentScore,
    lastScore,
    bestScore,
    worstScore,
    questionNumberDisplay,
    questionText,
    answers,
    correctAnswerIndex,
    buttonsData,
    children,
    highlight,
    imageType,
    // secondaryBorder, // <-- Entfernt, wird intern gesetzt
    // quizRoomTitleColor // <-- Entfernt, wird intern gesetzt
}) => {

    // Setze Farben und Border abhängig vom Mode (analog PrimaryContentbox)
    const quizRoomTitleColor = mode === 'publicquiz' ? '#2563EB' : '#ffc107';
    const customBorder = mode === 'publicquiz' ? 'blue' : mode === 'quiz' ? 'yellow' : undefined;

    const renderContent = () => {
        if (['quiz', 'publicquiz'].includes(mode)) {
            return (
                <>
                    <h4 className="quiz-room-title" style={{ color: quizRoomTitleColor }}>
                        {quizRoom}
                    </h4>
                    <div className="quiz-info-label">
                        {questionNumber}
                    </div>
                    <br />
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TAGS status="High" text={`${data.totalPoints} Punkte`} />
                    </div>
                    <br />
                    <img
                        src={
                            imageType === 'thumbsUP'
                                ? thumbsUPIcon
                                : imageType === 'wrong'
                                ? wrongIcon
                                : thinkingIcon
                        }
                        alt="Feedback"
                        className="image-secondaryContentbox"
                    />
                    {/* Reasontext soll immer angezeigt werden, wenn children vorhanden */}
                    {children && (
                        <div
                            style={{
                                marginTop: 24,
                                textAlign: 'left',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-line',
                                overflowWrap: 'anywhere',
                                width: '100%',
                                maxWidth: '100%',
                            }}
                        >
                            {children}
                        </div>
                    )}
                </>
            );
        } else if (mode === 'result') {
            return (
                <>
                    <span style={{ color: '#ffc107' }}>
                        <h3 className="quiz-room-title">{quizRoom}</h3>
                    </span>
                    <p className="score-display">Dein Score<br />{currentScore}</p>
                    <div>
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
        } else if (mode === 'newQuiz') {
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
        } else if (mode === 'emptyList') {
            return (
                <>
                    {children}
                </>
            );
        }
        return <p>Kein gültiger Anzeigemodus für SecondaryContentBox.</p>;
    };

    return (
        <div
            className={`content-box secondary-content-box${highlight ? ' highlight-edit' : ''}`}
            customborder={customBorder}
        >
            {renderContent()}
        </div>
    );
};

export default SecondaryContentBox;
