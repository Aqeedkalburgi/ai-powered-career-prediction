import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OverlayUI from './components/OverlayUI';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overlay" element={<OverlayUI />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



