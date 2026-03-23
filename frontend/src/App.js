import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components (create these if they don't exist)
import Dashboard from './components/Dashboard';
import JoinQueue from './components/JoinQueue';
import CheckStatus from './components/CheckStatus';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              🏥 SmartQueue
            </Link>
            <div className="navbar-nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/join" className="nav-link">Join Queue</Link>
              <Link to="/status" className="nav-link">Check Status</Link>
              <Link to="/staff" className="nav-link">Staff Portal</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/join" element={<JoinQueue />} />
            <Route path="/status" element={<CheckStatus />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div>
                <h5>Smart Hospital Queue</h5>
                <p>Revolutionizing patient flow with intelligent queue management for Maseno University.</p>
              </div>
              <div>
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/join">Join Queue</Link></li>
                  <li><Link to="/status">Check Status</Link></li>
                  <li><Link to="/staff">Staff Portal</Link></li>
                </ul>
              </div>
              <div>
                <h5>Contact</h5>
                <p>📞 +254 712 345 678</p>
                <p>✉️ info@smartqueue.health</p>
                <p>📍 Maseno University, Kenya</p>
              </div>
            </div>
            <div className="text-center mt-5">
              <p className="mb-0">&copy; 2026 Smart Hospital Queue. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="text-center py-5">
        <h1>Smart Hospital Queue System</h1>
        <p className="lead mb-4">Reduce waiting time with intelligent queue management</p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/join" className="btn btn-primary btn-lg pulse">
            🚀 Join Queue Now
          </Link>
          <Link to="/status" className="btn btn-secondary btn-lg">
            🔍 Check Your Status
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Dashboard />

      {/* Features Section */}
      <div className="row my-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="stat-icon">📱</div>
              <h3>Digital Tickets</h3>
              <p>Get your ticket instantly on your phone with QR code</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="stat-icon">⏱️</div>
              <h3>Real-time Updates</h3>
              <p>Track your position and estimated wait time</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="stat-icon">📨</div>
              <h3>SMS Notifications</h3>
              <p>Get notified when it's your turn via SMS</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card my-5">
        <div className="card-header">
          <h4 className="mb-0">📋 How It Works</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center">
              <div className="stat-icon">1️⃣</div>
              <h5>Join Queue</h5>
              <p>Select department and enter your details</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="stat-icon">2️⃣</div>
              <h5>Get Ticket</h5>
              <p>Receive QR code and SMS confirmation</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="stat-icon">3️⃣</div>
              <h5>Track Status</h5>
              <p>Monitor your position in real-time</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="stat-icon">4️⃣</div>
              <h5>Get Notified</h5>
              <p>Receive SMS when it's your turn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
