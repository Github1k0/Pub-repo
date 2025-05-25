import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTheme } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import CoinsPage from './pages/CoinsPage';
import ChartPage from './pages/ChartPage';
import FeedbackPage from './pages/FeedbackPage';
import './App.css'; // Ensure App.css is imported for page transition styles

function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); // Needed for TransitionGroup to detect route changes

  return (
    // Router is already here if App is not the top-most component being wrapped by BrowserRouter in main.jsx
    // If main.jsx wraps App with BrowserRouter, then Router here is not needed.
    // Assuming main.jsx has <Router><ThemeProvider><App /></ThemeProvider></Router> or similar.
    // For this setup, App itself doesn't need to render a Router if it's already within one.
    // However, useLocation() needs to be within a Router context.
    // The current setup in main.jsx is: <React.StrictMode><ThemeProvider><App /></ThemeProvider></React.StrictMode>
    // And App.jsx has <Router>...</Router>. This is correct.

    <div className={`app-container ${theme}`}>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/coins">Coins</Link></li>
          <li><Link to="/chart">Chart</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
        <button onClick={toggleTheme} className="theme-toggle-button">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </nav>
      <hr />
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} classNames="page-fade" timeout={400}>
          <div className="content-area"> {/* This div will be part of the transition */}
            <Routes location={location}> {/* Pass location to Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/coins" element={<CoinsPage />} />
              <Route path="/chart" element={<ChartPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

// Wrapper component to ensure App (which uses useLocation) is within Router context
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper; // Export the wrapper
