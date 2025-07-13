import React, { useState, useContext } from 'react';
import './SuccessPage.css'; 
import PrimaryContentBox from '../assets/components/PrimaryContentbox';
import SecondaryContentBox from '../assets/components/SecondaryContentbox';
import ButtonGroup from '../assets/components/ButtonGroup';
import NavBar from '../assets/components/NavBar';
import Header from '../assets/components/Header';


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

  // Daten für SecondaryContentBox (Score-Details)
  const secondaryContentData = {
    quizRoomTitle: "Quiz Room: Requirements Engineering",
    currentScore: "8 von 14 Punkten",
    lastScore: "9",
    bestScore: "13",
    worstScore: "4"
  };

  // Daten für die Buttons der ButtonGroup
  const buttonsData = [
    { label: "Neustart", type: "secondary", onClick: () => alert('Quiz neu starten!') },
    { label: "Dashboard", type: "primary", onClick: () => alert('Zum Dashboard navigieren!') }
  ];

  // ==========================================
  // RENDERING DER KOMPONENTEN
  // ==========================================

  return (
    <div className="quiz-layout-container">
      {/* PrimaryContentBox (nimmt 2/3 des Layouts ein) */}
      <PrimaryContentBox
        mainMessage={primaryContentData.mainMessage}
        subMessage={primaryContentData.subMessage}
      />

      {/* SecondaryContentBox (nimmt 1/3 des Layouts ein) */}
      <SecondaryContentBox
        quizRoomTitle={secondaryContentData.quizRoomTitle}
        currentScore={secondaryContentData.currentScore}
        lastScore={secondaryContentData.lastScore}
        bestScore={secondaryContentData.bestScore}
        worstScore={secondaryContentData.worstScore}
      />

      {/* ButtonGroup direkt in ResultPage gerendert */}
      <ButtonGroup buttons={buttonsData} />
    </div>
  );
}

export default SuccessPage;