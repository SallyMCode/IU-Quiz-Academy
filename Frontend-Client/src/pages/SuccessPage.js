import React, { useState, useContext } from 'react';
import './SuccessPage.css'; 
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import ButtonGroup from '../assets/components/ButtonGroup';
import { Link } from 'react-router-dom';
import NavBar from '../assets/components/NavBar';



const SuccessPage = () => {
 // ==========================================
  // HARTKODIERTE BEISPIELDATEN FÜR DIE ERGEBNISSE
  // Diese Daten würden dynamisch aus dem Backend kommen
  // ==========================================

  // Daten für PrimaryContentBox (Ergebnis-Nachricht)
  const primaryContentData = {
    mainMessage: "Geschafft! Quiz beendet...",
    subMessage: "Sieh dir deinen Score im Vergleich zu anderen an"
  };

  //Daten für SecondaryContentBox (Score-Details)
  const secondaryContentData = {
    quizRoom: "Datenbanksysteme & SQL Grundlagen", // Titel hierher verschoben
    currentScore: "8 von 14 Punkten",
    lastScore: "9",
    bestScore: "13",
    worstScore: "4"
  };

   // ==========================================
  // HANDLER-FUNKTIONEN FÜR DIE BUTTONS DER RESULTSEITE
  // ==========================================

  const handleRestartQuiz = () => {
    console.log("Quiz neu starten...");
    alert("Das Quiz wird neu gestartet!");
    // Hier würde die Logik zum Neustarten des Quiz implementiert
    // z.B. Navigation zur QuizPage oder Reset des Quiz-States
  };

  const handleGoToDashboard = () => {
    console.log("Zum Dashboard navigieren...");
    alert("Du wirst zum Dashboard weitergeleitet!");
    // Hier würde die Logik zur Navigation zum Dashboard implementiert
  };

  // Daten für die Buttons der ButtonGroup, direkt in ResultPage definiert
  const buttonsData = [
    { label: "Neustart", type: "secondary", onClick:handleRestartQuiz  },
    { label: "Dashboard", type: "primary", onClick: handleGoToDashboard }
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
        mode="result" // <-- Hier den Modus definieren
        mainMessage={primaryContentData.mainMessage}
        subMessage={primaryContentData.subMessage}
        buttons={buttonsData} // Übergibt die Button-Daten an PrimaryContentBox
      />

      {/* SecondaryContentBox (nimmt 1/3 des Layouts ein) */}
      <SecondaryContentBox
        mode="result" // <-- Hier den Modus definieren
        quizRoom={secondaryContentData.quizRoom}
        currentScore={secondaryContentData.currentScore}
        lastScore={secondaryContentData.lastScore}
        bestScore={secondaryContentData.bestScore}
        worstScore={secondaryContentData.worstScore}
      />
    </div>
    </div>
  );
}

export default SuccessPage;