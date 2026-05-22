import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useRef } from 'react';
import type { ScrollView } from 'react-native';

import { usePreferences } from '@/preferences/PreferencesProvider';

/**
 * Keeps the leading edge of a horizontal list aligned with the screen header
 * (logo / "All" chip): LTR → scroll start, RTL → scroll end.
 */
export function useLanguageAlignedHorizontalScroll(enabled = true) {
  const { language, isRtl } = usePreferences();
  const scrollRef = useRef<ScrollView | null>(null);
  const needsScrollRef = useRef(false);

  const applyScroll = useCallback(
    (animated: boolean) => {
      const scroll = scrollRef.current;
      if (!scroll) {
        return false;
      }

      if (isRtl) {
        scroll.scrollToEnd({ animated });
      } else {
        scroll.scrollTo({ x: 0, animated });
      }
      return true;
    },
    [isRtl],
  );

  const scheduleScroll = useCallback(() => {
    if (!enabled) {
      needsScrollRef.current = false;
      return;
    }

    needsScrollRef.current = true;

    if (applyScroll(false)) {
      needsScrollRef.current = false;
      return;
    }

    requestAnimationFrame(() => {
      if (applyScroll(true)) {
        needsScrollRef.current = false;
      }
    });
  }, [applyScroll, enabled]);

  const setScrollRef = useCallback(
    (node: ScrollView | null) => {
      scrollRef.current = node;
      if (node && needsScrollRef.current) {
        requestAnimationFrame(() => {
          if (applyScroll(false)) {
            needsScrollRef.current = false;
          }
        });
      }
    },
    [applyScroll],
  );

  const onContentSizeChange = useCallback(() => {
    if (!needsScrollRef.current) {
      return;
    }
    if (applyScroll(false)) {
      needsScrollRef.current = false;
    }
  }, [applyScroll]);

  useLayoutEffect(() => {
    scheduleScroll();
  }, [language, enabled, scheduleScroll]);

  useFocusEffect(
    useCallback(() => {
      scheduleScroll();
    }, [scheduleScroll]),
  );

  return { setScrollRef, onContentSizeChange };
}
