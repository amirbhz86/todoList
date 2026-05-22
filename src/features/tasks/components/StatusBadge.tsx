import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { AppView } from '@/components/ui/AppView';
import type { TaskStatus } from '@/domain/types/task';
import { useStatusBadgeStyles } from '@/features/tasks/components/useStyles';
import { taskStatusLabel } from '@/i18n/labels';

type StatusBadgeProps = {
  status: TaskStatus;
  compact?: boolean;
};

export function StatusBadge({ status, compact }: StatusBadgeProps) {
  const { t } = useTranslation();
  const styles = useStatusBadgeStyles(status, compact);

  return (
    <AppView surface="transparent" style={styles.badge}>
      <Text style={styles.label}>{taskStatusLabel(t, status)}</Text>
    </AppView>
  );
}
