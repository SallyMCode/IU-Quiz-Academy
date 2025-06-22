import React, { useState } from 'react';
import './LoginPage.css';
// Stelle sicher, dass dieser Pfad zu deinem Logo korrekt ist!
import QuizAcademyLogo from '../assets/QuizAcademyLogoBLANK.png'; //

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [passwordHash, setPasswordHash] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Benutzername:', username);
        console.log('Passwort (Hash):', passwordHash);
        alert(`Login-Versuch:\nBenutzername: ${username}\nPasswort-Hash: ${passwordHash}`);
    };

    return (
        <div className="login-container">
            {/* Das Formular ist die Contentbox. Bild und H2 kommen HIERHER. */}
            <form onSubmit={handleSubmit} className="login-form-box"> {/* NEU: Eine Klasse für das Formular hinzugefügt */}
                <img src={QuizAcademyLogo} alt="IU QuizAcademy Logo" className="login-logo" /> {/* Bild innerhalb des Formulars */}
                <h2>Login</h2> {/* Label "Login" innerhalb des Formulars */}
                <div className="form-group">
                    <label htmlFor="username">Benutzername:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordHash">Passwort:</label>
                    <input
                        type="password"
                        id="passwordHash"
                        value={passwordHash}
                        onChange={(e) => setPasswordHash(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Einloggen</button>
            </form>
        </div>
    );
};

export default LoginPage;