import React, { useState } from 'react';
import './QuizSession.css';
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import { useNavigate } from 'react-router-dom'; 
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';



const QuizSession = () => {
   // ==========================================
  // HARTKODIERTE BEISPIELDATEN FÜR DAS QUIZ
  // ==========================================


  const navigate = useNavigate(); // Hook initialisieren

  // Daten für PrimaryContentBox
  const quizData = {


    currentQuestion: 3, // Aktuelle Frage
    totalQuestions: 7,  // Gesamtanzahl der Fragen
    questionText: "Welcher SQL-Befehl wird verwendet, um neue Datensätze in eine Tabelle einzufügen?",
    options: [
      "UPDATE",
      "INSERT INTO",
      "ADD RECORD",
      "CREATE NEW"
    ]
  };

  // Daten für SecondaryContentBox
  const quizInfoData = {
    quizRoom: "Datenbanksysteme & SQL Grundlagen", // Titel hierher verschoben
    currentQuestionDisplay: `Frage ${quizData.currentQuestion} von ${quizData.totalQuestions}`,
    totalPoints: "4",
  };

  // ==========================================
  // HANDLER-FUNKTIONEN FÜR INTERAKTIONEN
  // ==========================================

  const handleOptionClick = (selectedOption) => {
    console.log("Ausgewählte Option:", selectedOption);
    alert(`Du hast "${selectedOption}" ausgewählt!`);
  };

  const handleNextQuestion = () => {
    console.log("Navigiere zur nächsten Frage...");
    alert("Gehe zur nächsten Frage!");
  };

  const handleCancelQuiz = () => {
    console.log("Quiz wird abgebrochen...");
    navigate('/Dashboard'); // Navigiert zur Route /Dashboard;
  };

  // Daten für die Buttons der ButtonGroup
  const buttonsData = [
    { label: "Abbrechen", type: "secondary", onClick: handleCancelQuiz }, // Handler zugewiesen
    { label: "Weiter", type: "primary", onClick: handleNextQuestion }    // Handler zugewiesen
  ];

  // ==========================================
  // RENDERING DER KOMPONENTEN
  // ==========================================

  return (
    <div> 
        <NavBar />
    <div className="quiz-layout-container">
      {/* PrimaryContentBox (nimmt 2/3 des Layouts ein) */}
      <PrimaryContentBox
        mode="quiz" // <-- Hier den Modus definieren
        questionText={quizData.questionText}
        options={quizData.options}
        onOptionClick={handleOptionClick}
        buttons={buttonsData} // Übergibt die Button-Daten an PrimaryContentBox
      />

      {/* SecondaryContentBox (nimmt 1/3 des Layouts ein) */}
      <SecondaryContentBox
        mode="quiz" // <-- Hier den Modus definieren
        quizRoom={quizInfoData.quizRoom} // Titel hier übergeben
        questionNumber={quizInfoData.currentQuestionDisplay}
        data={{
            totalPoints: quizInfoData.totalPoints,
        }}
      />
    </div>
    </div>
  );
}

export default QuizSession;

//     const [index, setIndex] = useState(0);
//     const [givenAnswer, setGivenAnswer] = useState(null); // Speichert den Index der VOM BENUTZER GEGEBENEN Antwort
//     const [answered, setAnswered] = useState(false); //wurde die Frage schon beantwortet ?
//     const [score, setScore] = useState(0); // Punktestand

//     const question = questionlist.length > index ? questionlist[index] : null;

//     if (!question) {
//               if (index >= questionlist.length && questionlist.length > 0) {
//             return (
//                 <div className="container">
//                     <h2>Quiz beendet!</h2>
//                     <p>Dein Ergebnis: {score} von {questionlist.length} Punkten</p>
//                     <button onClick={() => {
//                         setIndex(0);
//                         setGivenAnswer(null);
//                         setAnswered(false);
//                         setScore(0);
//                     }}>Neustart</button>
//                 </div>
//             );
//         }
//         return <div className="container"><h2>Keine Fragen geladen oder Quiz beendet.</h2></div>;
//     }

//     // ACHTUNG: Hier muss 'optionIndex' (0, 1, 2, 3) übergeben werden, nicht 1, 2, 3, 4
//     const checkAnswer = (optionIndex) => {
//         if (answered) {
//             return;
//         }

//         setGivenAnswer(optionIndex); // Speichere den Index der gegebenen Antwort
//         setAnswered(true);
        
//          if (optionIndex === correctAnswer) {
//             setScore(prevScore => prevScore + 1); // Erhöhe den Punktestand bei korrekter Antowrt
//         }

//     };

//     const nextQuestion = () => {
//         if (index < questionlist.length - 1) { // Gehe zur nächsten Frage, wenn es noch welche gibt
//             setIndex(prevIndex => prevIndex + 1);
//             setGivenAnswer(null); // Setze gegebene Antwort zurück für die nächste Frage
//             setAnswered(false);   // Setze den "beantwortet"-Status zurück
//         } else {
//             setIndex(prevIndex => prevIndex + 1); // Erhöhe den Index, um den "Quiz beendet" Zustand zu erreichen
//         }
//     };

//     const correctAnswer = question.correctAnswer;

//     return (
//         <div className="container">
//             <h1>iU QuizAcademy</h1>
//             <hr />
//             <h2>{index + 1}. {question.question}</h2>
//             <ul>
//                 {question.options.map((optionText, optionIndex) => {
//                     let liClassName = '';
//                     if (answered) { // Wenn die Frage beantwortet wurde
//                         // Die vom User GEGEBENE Antwort
//                         if (optionIndex === givenAnswer) {
//                             if (optionIndex === correctAnswer) { // Vergleich mit der KORREKTEN Antwort
//                                 liClassName = 'correct';
//                             } else {
//                                 liClassName = 'wrong';
//                             }
//                         }
//                         // Die tatsächliche korrekte Antwort, auch wenn nicht vom Benutzer gewählt
//                         else if (optionIndex === correctAnswer) {
//                             liClassName = 'correct';
//                         }
//                     } else if (givenAnswer === optionIndex) {
//                         // Markiere die aktuell ausgewählte Option, bevor die Antwort bewertet wird
//                         liClassName = 'selected';
//                     }

//                     return (
//                         <li
//                             key={optionIndex}
//                             onClick={() => checkAnswer(optionIndex)}
//                             className={liClassName}
//                         >
//                             {optionText}
//                         </li>
//                     );
//                 })}
//             </ul>
//             <button onClick={nextQuestion}>Weiter</button>
//             <div className="index">Frage {index + 1} von {questionlist.length}</div>
//             <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' }}>
//                 Aktueller Score: {score}
//             </div>
//         </div>
//     );


