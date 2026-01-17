import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';

const i18n = new I18n({
  en,
  es,
});

i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

export const getLocale = () => i18n.locale;

export default i18n;
