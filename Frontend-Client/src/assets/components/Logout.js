import { useNavigate } from 'react-router-dom';
import React from 'react';

function Logout() {
const navigate = useNavigate();

React.useEffect(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  navigate('/'); // Zurück zur Login-Seite
}, [navigate]);

return null; // Diese Komponente rendert nichts
}

export default Logout;
