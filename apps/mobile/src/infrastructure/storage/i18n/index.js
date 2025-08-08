"use strict";
/**
 * i18n Configuration
 *
 * Internationalization setup for the CleanSlate Mobile App.
 * Uses shared translation files from the packages/shared/i18n directory.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
// Import shared translation resources
var en_json_1 = require("../../../../../../packages/shared/i18n/en.json");
var ar_json_1 = require("../../../../../../packages/shared/i18n/ar.json");
// Detect device language
var deviceLanguage = function () {
    var locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.split('-')[0]; // Extract language code (e.g., 'en' from 'en-US')
};
// Configure i18n
i18next_1.default
    .use(react_i18next_1.initReactI18next)
    .init({
    resources: {
        en: { translation: en_json_1.default },
        ar: { translation: ar_json_1.default },
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
exports.default = i18next_1.default;
