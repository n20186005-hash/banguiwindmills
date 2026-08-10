// Legacy i18n stub — no longer used (single-language site)
export const languagesList = ['en'] as const;
export type Language = (typeof languagesList)[number];
export const defaultLang: Language = 'en';
