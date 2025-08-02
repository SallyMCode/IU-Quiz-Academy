import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import CommunityPage from './pages/CommunityPage';
import NewQuizRoomPage from './pages/NewQuizRoomPage';
import QuizSession from './pages/QuizSession';
import SuccessPage from './pages/SuccessPage';
import Logout from './assets/components/Logout';
import ThreadPage from './pages/ThreadPage'; // neue Komponente für einzelne Threads
import UserQuizRooms from './pages/UserQuizRooms'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainPage />} />
        <Route path="/forum" element={<CommunityPage />} />
        <Route path="/community/thread/:threadId" element={<ThreadPage />} />
        <Route path="/Quizsession" element={<QuizSession />} />
        <Route path="/SuccessPage" element={<SuccessPage />} />
        <Route path="/NewQuizroom" element={<NewQuizRoomPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/userquizrooms" element={<UserQuizRooms />} />
      </Routes>
    </Router>
  );
}

export default App;