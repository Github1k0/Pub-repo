import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTheme } from './contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher'; // Import LanguageSwitcher
import HomePage from './pages/HomePage';
import CoinsPage from './pages/CoinsPage';
import ChartPage from './pages/ChartPage';
import FeedbackPage from './pages/FeedbackPage';
import './App.css'; 

function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); 
  const { t } = useTranslation(); 

  return (
    <div className={`app-container ${theme}`}>
      <nav>
        <ul>
          <li><Link to="/">{t('nav_home')}</Link></li>
          <li><Link to="/coins">{t('nav_coins')}</Link></li>
          <li><Link to="/chart">{t('nav_chart')}</Link></li>
          <li><Link to="/feedback">{t('nav_feedback')}</Link></li>
        </ul>
        <div className="nav-controls"> {/* Wrapper for theme toggle and lang switcher */}
          <LanguageSwitcher />
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? t('theme_toggle_to_dark') : t('theme_toggle_to_light')}
          </button>
        </div>
      </nav>
      <hr />
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} classNames="page-fade" timeout={400}>
          <div className="content-area"> 
            <Routes location={location}> 
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

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
