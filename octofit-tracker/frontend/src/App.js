import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Users from './components/Users';
import Teams from './components/Teams';
import Workouts from './components/Workouts';
import Leaderboard from './components/Leaderboard';

function Home() {
  const codespace = process.env.REACT_APP_CODESPACE_NAME || 'REACT_APP_CODESPACE_NAME';
  const base = `https://${codespace}-8000.app.github.dev/api/`;
  console.log('[App] Codespace:', codespace, 'API base:', base);
  return (
    <div className="container mt-4">
      <h2>Octofit Tracker</h2>
      <p>Use the navigation menu to view components that fetch from the backend API.</p>
      <p>Example API base: <code>{base}</code></p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src="https://raw.githubusercontent.com/rippltho/skills-build-applications-w-copilot-agent-mode/build-octofit-app/docs/octofitapp-small.png" alt="Octofit" style={{height: '36px', marginRight: '10px'}} />
            Octofit Tracker
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link" to="/activities">Activities</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/users">Users</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/teams">Teams</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/workouts">Workouts</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
