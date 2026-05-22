import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useStateViewStyles } from '@/components/ui/useStyles';
import { useMaterialTheme } from '@/theme/ThemeProvider';

type StateViewProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
};

export function StateView({
  loading,
  error,
  empty,
  emptyTitle,
  emptyMessage,
  onRetry,
  children,
}: StateViewProps) {
  const { t } = useTranslation();
  const styles = useStateViewStyles();
  const { colors } = useMaterialTheme();

  const resolvedEmptyTitle = emptyTitle ?? t('state.noTasksYet');
  const resolvedEmptyMessage = emptyMessage ?? t('state.noTasksYetMessage');

  if (loading) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingMessage}>{t('state.loadingTasks')}</Text>
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View entering={FadeIn} style={styles.centeredPadded}>
        <Text style={styles.errorTitle}>{t('state.somethingWentWrong')}</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {onRetry ? (
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryLabel}>{t('common.tryAgain')}</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    );
  }

  if (empty) {
    return (
      <Animated.View entering={FadeIn} style={styles.centeredPadded}>
        <Text style={styles.emptyTitle}>{resolvedEmptyTitle}</Text>
        <Text style={styles.emptyMessage}>{resolvedEmptyMessage}</Text>
      </Animated.View>
    );
  }

  return children ? <>{children}</> : null;
}
