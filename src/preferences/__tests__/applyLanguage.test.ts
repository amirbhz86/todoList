import { I18nManager } from 'react-native';

import i18n from '@/i18n';
import {
  applyAppLanguageText,
  applyAppLayoutDirection,
  changeAppLanguage,
  isRtlLanguage,
} from '@/preferences/applyLanguage';

jest.mock('expo', () => ({
  reloadAppAsync: jest.fn(() => Promise.resolve()),
}));

const { reloadAppAsync } = jest.requireMock<{ reloadAppAsync: jest.Mock }>('expo');

describe('isRtlLanguage', () => {
  it('returns true for Persian', () => {
    expect(isRtlLanguage('fa')).toBe(true);
  });

  it('returns false for English', () => {
    expect(isRtlLanguage('en')).toBe(false);
  });
});

describe('applyAppLanguageText', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('changes i18n language', async () => {
    await applyAppLanguageText('fa');
    expect(i18n.language).toBe('fa');
  });

  it('skips when language is unchanged', async () => {
    await i18n.changeLanguage('en');
    const spy = jest.spyOn(i18n, 'changeLanguage');
    await applyAppLanguageText('en');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('applyAppLayoutDirection', () => {
  beforeEach(() => {
    reloadAppAsync.mockClear();
    I18nManager.isRTL = false;
  });

  it('reloads when RTL direction changes', async () => {
    await applyAppLayoutDirection('fa');
    expect(reloadAppAsync).toHaveBeenCalled();
  });

  it('does not reload when direction already matches', async () => {
    I18nManager.isRTL = true;
    await applyAppLayoutDirection('fa');
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });
});

describe('changeAppLanguage', () => {
  beforeEach(() => {
    reloadAppAsync.mockClear();
    I18nManager.isRTL = false;
  });

  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('updates text and layout for English', async () => {
    await i18n.changeLanguage('fa');
    I18nManager.isRTL = true;
    await changeAppLanguage('en');
    expect(i18n.language).toBe('en');
    expect(reloadAppAsync).toHaveBeenCalled();
  });
});
