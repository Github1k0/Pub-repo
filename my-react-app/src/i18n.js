import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translations from backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    supportedLngs: ['ru', 'en'], // Explicitly set supported languages
    fallbackLng: 'ru', // Fallback language
    defaultNS: 'translation', // Default namespace for translations
    ns: ['translation'], // Namespaces to load
    debug: true, // Enable debug output in console
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    // LanguageDetector options:
    // We want to prioritize 'ru' for this task.
    // If you want to strictly use 'ru' initially and allow 'en' only via explicit toggle,
    // you might configure order and lookup methods. For now, default LanguageDetector
    // behavior with 'ru' as fallback and in supportedLngs should work.
    // Forcing 'ru' if that was a strict requirement:
    // order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    // lookupQuerystring: 'lng',
    // lookupLocalStorage: 'i18nextLng',
    // caches: ['localStorage'],
    // checkWhitelist: true, // ensure that detected lang is in supportedLngs
  });

export default i18n;
