import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import CommunityPage from './pages/CommunityPage';
import Logout from './assets/components/Logout';
import ThreadPage from './pages/ThreadPage'; // neue Komponente für einzelne Threads

function App() {
return (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<MainPage />} />
      <Route path="/forum" element={<CommunityPage />} />
      <Route path="/community/thread/:threadId" element={<ThreadPage />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </Router>
);
}

export default App;