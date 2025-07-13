import React from 'react';
import './SecondaryContentbox.css';
import checkIcon from '../images/Check_icon.svg.png';
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
    worstScore // Für Result-Modus
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
                    <br/>
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
                    <img src={checkIcon} alt="CheckSymbol" className="image-secondaryContentbox"/>
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