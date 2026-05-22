import { useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

const layout = StyleSheet.create({
  shell: { flex: 1 },
});

export function useThemeShellStyles() {
  return useMemo(() => ({ shell: layout.shell as ViewStyle }), []);
}
