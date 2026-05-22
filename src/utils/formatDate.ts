import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { usePreferences } from '@/preferences/PreferencesProvider';
import type { AppLanguage } from '@/preferences/types';

function localeTag(language: AppLanguage): string {
  return language === 'fa' ? 'fa-IR' : 'en-US';
}

export function formatTaskDate(isoDate: string, language: AppLanguage): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(localeTag(language), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(
  isoDate: string,
  t: TFunction,
  language: AppLanguage,
): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return t('date.invalid');
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('date.today');
  if (diffDays === 1) return t('date.yesterday');
  if (diffDays < 7) return t('date.daysAgo', { count: diffDays });
  return formatTaskDate(isoDate, language) || t('date.invalid');
}

/** Subscribes to language changes so relative dates re-render with the active locale. */
export function useFormatRelativeDate() {
  const { t } = useTranslation();
  const { language } = usePreferences();

  return useCallback(
    (isoDate: string) => formatRelativeDate(isoDate, t, language),
    [t, language],
  );
}
