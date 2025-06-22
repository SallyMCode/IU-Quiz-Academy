import React, { useState } from 'react';
import './Quiz.css';
import { questionlist } from '../assets/QuestionsData';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [givenAnswer, setGivenAnswer] = useState(null); // Speichert den Index der VOM BENUTZER GEGEBENEN Antwort
    const [answered, setAnswered] = useState(false); //wurde die Frage schon beantwortet ?
    const [score, setScore] = useState(0); // Punktestand

    const question = questionlist.length > index ? questionlist[index] : null;

    if (!question) {
              if (index >= questionlist.length && questionlist.length > 0) {
            return (
                <div className="container">
                    <h2>Quiz beendet!</h2>
                    <p>Dein Ergebnis: {score} von {questionlist.length} Punkten</p>
                    <button onClick={() => {
                        setIndex(0);
                        setGivenAnswer(null);
                        setAnswered(false);
                        setScore(0);
                    }}>Neustart</button>
                </div>
            );
        }
        return <div className="container"><h2>Keine Fragen geladen oder Quiz beendet.</h2></div>;
    }

    // ACHTUNG: Hier muss 'optionIndex' (0, 1, 2, 3) übergeben werden, nicht 1, 2, 3, 4
    const checkAnswer = (optionIndex) => {
        if (answered) {
            return;
        }

        setGivenAnswer(optionIndex); // Speichere den Index der gegebenen Antwort
        setAnswered(true);
        
         if (optionIndex === correctAnswer) {
            setScore(prevScore => prevScore + 1); // Erhöhe den Punktestand bei korrekter Antowrt
        }

    };

    const nextQuestion = () => {
        if (index < questionlist.length - 1) { // Gehe zur nächsten Frage, wenn es noch welche gibt
            setIndex(prevIndex => prevIndex + 1);
            setGivenAnswer(null); // Setze gegebene Antwort zurück für die nächste Frage
            setAnswered(false);   // Setze den "beantwortet"-Status zurück
        } else {
            setIndex(prevIndex => prevIndex + 1); // Erhöhe den Index, um den "Quiz beendet" Zustand zu erreichen
        }
    };

    const correctAnswer = question.correctAnswer;

    return (
        <div className="container">
            <h1>iU QuizAcademy</h1>
            <hr />
            <h2>{index + 1}. {question.question}</h2>
            <ul>
                {question.options.map((optionText, optionIndex) => {
                    let liClassName = '';
                    if (answered) { // Wenn die Frage beantwortet wurde
                        // Die vom User GEGEBENE Antwort
                        if (optionIndex === givenAnswer) {
                            if (optionIndex === correctAnswer) { // Vergleich mit der KORREKTEN Antwort
                                liClassName = 'correct';
                            } else {
                                liClassName = 'wrong';
                            }
                        }
                        // Die tatsächliche korrekte Antwort, auch wenn nicht vom Benutzer gewählt
                        else if (optionIndex === correctAnswer) {
                            liClassName = 'correct';
                        }
                    } else if (givenAnswer === optionIndex) {
                        // Markiere die aktuell ausgewählte Option, bevor die Antwort bewertet wird
                        liClassName = 'selected';
                    }

                    return (
                        <li
                            key={optionIndex}
                            onClick={() => checkAnswer(optionIndex)}
                            className={liClassName}
                        >
                            {optionText}
                        </li>
                    );
                })}
            </ul>
            <button onClick={nextQuestion}>Weiter</button>
            <div className="index">Frage {index + 1} von {questionlist.length}</div>
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' }}>
                Aktueller Score: {score}
            </div>
        </div>
    );
};

export default Quiz;