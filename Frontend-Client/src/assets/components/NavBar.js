import React from 'react';
import { Link } from 'react-router-dom'; // Wichtig: Link importieren

function NavBar() {
  return (
    <nav>
      <div className="nav-left">
        <img src="/logoQuizAcademypng.png" alt="Logo" />
        <div className="logo">IU-Quiz-Academy</div>
      </div>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><a href="#">Quizräume</a></li>
        <li><a href="#">Statistiken</a></li>
        <li><Link to="/forum">Forum</Link></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;