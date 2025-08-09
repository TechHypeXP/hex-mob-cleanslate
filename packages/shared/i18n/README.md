# Shared Internationalization (i18n)

## Responsibility
The shared i18n directory contains language translation files and internationalization utilities that are shared across applications.

## Architectural Purpose
- **Localization Consistency**: Provide consistent translations across applications
- **Language Support**: Enable multi-language support for shared components
- **Centralized Translations**: Manage translations in one location
- **Cultural Adaptation**: Support cultural differences in content presentation

## Developer Guidelines
- Add translations for strings that are truly shared across applications
- Maintain consistent key naming conventions
- Keep translations organized by feature or domain
- Support all required languages for the product
- Test translations with native speakers when possible

## Examples
```json
// Example English translation file (en.json)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "photo": {
    "upload": "Upload Photo",
    "caption": "Caption",
    "description": "Description"
  }
}
```

```typescript
// Example i18n utility
import en from './en.json';
import ar from './ar.json';

const translations = { en, ar };

export const t = (key: string, language: string = 'en'): string => {
  return key.split('.').reduce((obj, k) => obj?.[k], translations[language]) || key;
};
```

## Boundaries
- Shared translations should not have application-specific strings
- Keep translation files organized and maintainable
- Changes may affect multiple applications
- Part of the overall shared package structure