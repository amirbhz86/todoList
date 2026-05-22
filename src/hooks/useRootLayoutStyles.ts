import { useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

const layout = StyleSheet.create({
  root: { flex: 1 },
});

export function useRootLayoutStyles() {
  return useMemo(() => ({ root: layout.root as ViewStyle }), []);
}
