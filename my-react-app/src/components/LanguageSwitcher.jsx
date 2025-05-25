import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'; // We'll create this CSS file

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Supported languages from i18n config (or define manually if preferred)
  // const supportedLanguages = i18n.options.supportedLngs || ['en', 'ru'];
  // Filter out 'dev' language if it's present from i18next-browser-languagedetector
  const languages = (i18n.options.supportedLngs || []).filter(lng => lng !== 'dev');


  return (
    <div className="language-switcher">
      <span className="language-switcher-label">{t('lang_switcher_label')}</span>
      {languages.map((lng) => (
        <button
          key={lng}
          className={`language-button ${i18n.resolvedLanguage === lng ? 'active' : ''}`}
          type="button"
          onClick={() => changeLanguage(lng)}
          disabled={i18n.resolvedLanguage === lng}
        >
          {t(`lang_${lng}`)}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
