import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { AppView } from '@/components/ui/AppView';
import type { TaskPriority } from '@/domain/types/task';
import { usePriorityIndicatorStyles } from '@/features/tasks/components/useStyles';
import { taskPriorityLabel } from '@/i18n/labels';

type PriorityIndicatorProps = {
  priority: TaskPriority;
  compact?: boolean;
};

export function PriorityIndicator({ priority, compact }: PriorityIndicatorProps) {
  const { t } = useTranslation();
  const styles = usePriorityIndicatorStyles(priority, compact);

  return (
    <AppView surface="transparent" style={styles.row}>
      <AppView surface="transparent" style={styles.dot} />
      <Text style={styles.label}>{taskPriorityLabel(t, priority)}</Text>
    </AppView>
  );
}
