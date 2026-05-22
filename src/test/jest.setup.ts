import '@testing-library/react-native/build/matchers/extend-expect';

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    NativeViewGestureHandler: View,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => inset,
  };
});

jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MaterialIcons(props: { name: string }) {
    return React.createElement(Text, null, props.name);
  };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('@/theme/FontProvider', () => {
  const React = require('react');
  return {
    FontProvider: ({ children }: { children: React.ReactNode }) => children,
    useFontsReady: () => true,
  };
});

jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('@/preferences/storage', () => ({
  loadPreferences: jest.fn().mockResolvedValue({ language: 'en' }),
  savePreferences: jest.fn().mockResolvedValue(undefined),
}));

jest.mock(
  '@gorhom/bottom-sheet',
  () => {
  const React = require('react');
  const { View, ScrollView } = require('react-native');

  const BottomSheetModal = React.forwardRef(
    (
      {
        children,
        onChange,
        onDismiss,
      }: {
        children: React.ReactNode;
        onChange?: (index: number) => void;
        onDismiss?: () => void;
      },
      ref: React.Ref<{ present: () => void; dismiss: () => void }>,
    ) => {
      const [open, setOpen] = React.useState(false);
      React.useImperativeHandle(ref, () => ({
        present: () => {
          setOpen(true);
          onChange?.(0);
        },
        dismiss: () => {
          setOpen(false);
          onChange?.(-1);
          onDismiss?.();
        },
      }));
      if (!open) return null;
      return React.createElement(View, { testID: 'bottom-sheet-modal' }, children);
    },
  );

  const BottomSheetScrollView = ({
    children,
    contentContainerStyle,
  }: {
    children: React.ReactNode;
    contentContainerStyle?: object;
  }) => React.createElement(ScrollView, { contentContainerStyle }, children);

  const BottomSheetBackdrop = () => null;

  return {
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetBackdrop,
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
  };
  },
  { virtual: true },
);

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  const DraggableFlatList = (props: Record<string, unknown>) =>
    React.createElement(FlatList, props);
  return {
    __esModule: true,
    default: DraggableFlatList,
    ScaleDecorator: ({ children }: { children: React.ReactNode }) => children,
  };
});

import { i18nReady } from '@/i18n';

beforeAll(async () => {
  await i18nReady;
});
