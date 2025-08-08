/**
 * i18n Configuration
 *
 * Internationalization setup for the CleanSlate Mobile App.
 * Uses shared translation files from the packages/shared/i18n directory.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import shared translation resources
import en from '../../../../../../packages/shared/i18n/en.json';
import ar from '../../../../../../packages/shared/i18n/ar.json';

// Detect device language
const deviceLanguage = () => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  return locale.split('-')[0]; // Extract language code (e.g., 'en' from 'en-US')
};

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: deviceLanguage(), // Use device language
    fallbackLng: 'en', // Fallback to English
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
  });

export default i18n;