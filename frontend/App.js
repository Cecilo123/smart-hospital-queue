import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Dashboard from './components/Dashboard';
import JoinQueue from './components/JoinQueue';
import CheckStatus from './components/CheckStatus';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">Smart Queue</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/join">Join Queue</Link>
              <Link className="nav-link" to="/status">Check Status</Link>
              <Link className="nav-link" to="/staff">Staff</Link>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/join" element={<JoinQueue />} />
            <Route path="/status" element={<CheckStatus />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;