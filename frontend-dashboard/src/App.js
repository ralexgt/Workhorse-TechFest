import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Home from './Home';
import './Home.css';
import './Dashboard.css';

// ...brands array...
function Application() {
  // ...your existing home page code...
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: send data to backend here
    navigate('/dashboard'); // Go to dashboard after submit
  };

  // ...return your form as before...
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;