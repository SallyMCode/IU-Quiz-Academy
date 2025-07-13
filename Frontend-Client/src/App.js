import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';

import MainPage from './pages/MainPage';
import CommunityPage from './pages/CommunityPage';
import LoginPage from './pages/LoginPage';
import NewQuizRoomPage from './pages/NewQuizRoomPage';
import QuizSession from './pages/QuizSession';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<MainPage />} />
        <Route path="/forum" element={<CommunityPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/NewQuizRoom" element={<NewQuizRoomPage />} />
        <Route path="/QuizSession" element={<QuizSession />} />
        <Route path="/SuccessPage" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;