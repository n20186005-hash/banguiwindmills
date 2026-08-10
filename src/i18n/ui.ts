export const languagesList = ['en', 'zh', 'fil'] as const;
export type Language = (typeof languagesList)[number];
export const defaultLang: Language = 'en';
