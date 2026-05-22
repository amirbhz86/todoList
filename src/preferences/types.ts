export type AppLanguage = 'fa' | 'en';

export type AppPreferences = {
  language: AppLanguage;
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  language: 'fa',
};
