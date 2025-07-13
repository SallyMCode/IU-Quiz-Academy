import React from 'react';
import { Link } from 'react-router-dom'; // Wichtig: Link importieren
import Logo from '../images/QuizAcademylogoBLANK.png'; // Importiere das Logo


function NavBar() {
  return (
    <nav>
      <div className="nav-left">
        <img src={Logo} alt="Logo" className="logo-image" />
        <div className="logo">IU-Quiz-Academy</div>
      </div>
      <ul>
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li><a href="#">Quizräume</a></li>
        <li><a href="#">Statistiken</a></li>
        <li><Link to="/forum">Forum</Link></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;