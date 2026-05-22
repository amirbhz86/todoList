import { useMemo } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import { useMaterialTheme } from '@/theme/ThemeProvider';

export function useStatsScreenStyles() {
  const { semantic, typography, fonts } = useMaterialTheme();

  return useMemo(
    () => ({
      accentColor: semantic.green,
      progressTodo: semantic.blue,
      progressInProgress: semantic.amber,
      progressDone: semantic.green,
      progressHigh: semantic.red,
      progressMedium: semantic.amber,
      progressLow: semantic.green,
      container: {
        flex: 1,
        backgroundColor: semantic.bg,
      } as ViewStyle,
      scroll: {
        paddingBottom: 24,
      } as ViewStyle,
      content: {
        paddingHorizontal: 18,
        gap: 12,
      } as ViewStyle,
      statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
      } as ViewStyle,
      statCard: {
        width: '48%',
        flexGrow: 1,
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 18,
        padding: 14,
      } as ViewStyle,
      statLabel: {
        ...typography.labelMedium,
        color: semantic.textMuted,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 5,
      } as TextStyle,
      statValue: {
        fontFamily: fonts.displayBold,
        fontSize: 26,
        letterSpacing: -1,
      } as TextStyle,
      statValuePrimary: {
        fontFamily: fonts.displayBold,
        fontSize: 26,
        letterSpacing: -1,
        color: semantic.textPrimary,
      } as TextStyle,
      statValueGreen: {
        fontFamily: fonts.displayBold,
        fontSize: 26,
        letterSpacing: -1,
        color: semantic.green,
      } as TextStyle,
      statValueAmber: {
        fontFamily: fonts.displayBold,
        fontSize: 26,
        letterSpacing: -1,
        color: semantic.amber,
      } as TextStyle,
      statValueRed: {
        fontFamily: fonts.displayBold,
        fontSize: 26,
        letterSpacing: -1,
        color: semantic.red,
      } as TextStyle,
      progSection: {
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 16,
      } as ViewStyle,
      progSectionTitle: {
        ...typography.labelMedium,
        color: semantic.textMuted,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 13,
      } as TextStyle,
      progRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 11,
      } as ViewStyle,
      progLabel: {
        width: 82,
        fontSize: 12.5,
        color: semantic.textSecondary,
      } as TextStyle,
      progTrack: {
        flex: 1,
        height: 5,
        backgroundColor: semantic.surface3,
        borderRadius: 99,
        overflow: 'hidden',
      } as ViewStyle,
      progFill: {
        height: '100%',
        borderRadius: 99,
      } as ViewStyle,
      getProgFill: (color: string) =>
        ({
          height: '100%',
          borderRadius: 99,
          backgroundColor: color,
        }) as ViewStyle,
      progNum: {
        ...typography.labelMedium,
        width: 18,
        textAlign: 'right',
        color: semantic.textMuted,
      } as TextStyle,
    }),
    [fonts.displayBold, semantic, typography],
  );
}
