import i18n, { InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, it } from './locales';

const options: InitOptions = {
  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  debug: false,

  resources: {
    en: {
      app: en.app,
    },
    it: {
      app: it.app,
    },
  },

  defaultNS: 'app',
  fallbackLng: 'en',
  fallbackNS: ['app'],
  keySeparator: '.',
  ns: [
    'app',
  ],
};

i18n.use(LanguageDetector).init(options);
export default i18n;
