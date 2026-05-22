import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { render, type RenderOptions } from '@testing-library/react-native';
import React, { type ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import i18n from '@/i18n';
import { TaskSheetsProvider } from '@/features/tasks/sheets/TaskSheetsProvider';
import { PreferencesProvider } from '@/preferences/PreferencesProvider';
import { createTestStore, type TestRootState } from '@/test/createTestStore';
import { FontProvider } from '@/theme/FontProvider';
import { MaterialThemeProvider } from '@/theme/ThemeProvider';

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<TestRootState>;
};

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, ...options }: RenderWithProvidersOptions = {},
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PreferencesProvider>
            <FontProvider>
              <MaterialThemeProvider>
                <BottomSheetModalProvider>
                  <TaskSheetsProvider>{children}</TaskSheetsProvider>
                </BottomSheetModalProvider>
              </MaterialThemeProvider>
            </FontProvider>
          </PreferencesProvider>
        </I18nextProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
