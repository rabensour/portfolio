import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Composants (à implémenter)
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>📱 Social Media App</h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
