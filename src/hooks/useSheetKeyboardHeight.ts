import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useEffect, type RefObject } from 'react';
import { Keyboard, Platform } from 'react-native';

type Options = {
  collapsedIndex?: number;
  expandedIndex?: number;
};

/**
 * Snaps a bottom sheet taller while the keyboard is visible and back when it hides.
 */
export function useSheetKeyboardHeight(
  sheetRef: RefObject<BottomSheetModal | null>,
  enabled: boolean,
  { collapsedIndex = 0, expandedIndex = 1 }: Options = {},
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      sheetRef.current?.snapToIndex(expandedIndex);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      sheetRef.current?.snapToIndex(collapsedIndex);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [collapsedIndex, enabled, expandedIndex, sheetRef]);
}
