import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import './Home.css';
import './Dashboard.css';

function App() {
  const [backendResponse, setBackendResponse] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setBackendResponse={setBackendResponse} />} />
        <Route path="/dashboard" element={<Dashboard response={backendResponse} />} />
      </Routes>
    </Router>
  );
}

export default App;