import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.jsx'; 
import { ThemeProvider } from './contexts/ThemeContext';
import i18n from './i18n'; // Import i18n instance
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import './index.css';

// A simple functional component for the fallback UI that uses i18n.t
const LoadingFallback = () => {
  // We can't use the hook here directly as main.jsx is outside I18nextProvider context at this point
  // So, we access t function from the i18n instance directly for the initial fallback.
  // This is a bit of a workaround. Ideally, the fallback is a very simple static string or component.
  // Or, ensure i18n is initialized before this is ever called if it needs complex translation.
  // For "Loading translations..." it's simple enough.
  // Let's assume i18n is already initialized enough to have 'ru' or 'en' fallback by this point.
  const initialLang = i18n.language || 'ru'; // Get current or fallback
  const loadingText = initialLang === 'ru' ? 'Загрузка переводов...' : 'Loading translations...';

  return <div>{loadingText}</div>;
};


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AppWrapper />
        </ThemeProvider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);
