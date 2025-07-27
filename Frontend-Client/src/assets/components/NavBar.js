import React from 'react';
import { Link } from 'react-router-dom'; // Wichtig: Link importieren
import QuizAcademyLogo from '../images/QuizAcademylogoBLANK.png'; // Importiere das Logo


function NavBar() {
return (
  <nav>
    <div className="nav-left">
      <img src= {QuizAcademyLogo} alt="Logo" />
      <div className="logo">IU-Quiz-Academy</div>
    </div>
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/userquizrooms">Quizräume</Link></li>
      <li><Link to="/forum">Forum</Link></li>
      <li><Link to="/logout">Logout</Link></li>
    </ul>
  </nav>
);
}

export default NavBar;