import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TaskFlowTopBar } from '@/components/navigation/TaskFlowTopBar';
import { StateView } from '@/components/ui/StateView';
import { useStatsScreenStyles } from '@/features/stats/screens/useStyles';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTaskStats,
  selectTasksError,
  selectTasksLoading,
} from '@/store/tasks/selectors';
import { tasksActions } from '@/store/tasks/tasksSlice';

function ProgressRow({
  label,
  count,
  pct,
  color,
  delay,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
  delay: number;
}) {
  const styles = useStatsScreenStyles();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(pct, { duration: 600 });
  }, [pct, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.progRow}>
      <Text style={styles.progLabel}>{label}</Text>
      <View style={styles.progTrack}>
        <Animated.View style={[styles.getProgFill(color), fillStyle]} />
      </View>
      <Text style={styles.progNum}>{count}</Text>
    </Animated.View>
  );
}

export function StatsScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useStatsScreenStyles();
  const stats = useAppSelector(selectTaskStats);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  const loadTasks = useCallback(() => {
    dispatch(tasksActions.fetchTasksRequest());
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const topBar = (
    <TaskFlowTopBar
      accentColor={styles.accentColor}
      title={t('stats.title')}
      titleAccent={t('stats.titleAccent')}
    />
  );

  if (loading && stats.total === 0) {
    return (
      <View style={styles.container}>
        {topBar}
        <StateView loading />
      </View>
    );
  }

  if (error && stats.total === 0) {
    return (
      <View style={styles.container}>
        {topBar}
        <StateView error={error} onRetry={loadTasks} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topBar}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statGrid}>
            <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.statCard}>
              <Text style={styles.statLabel}>{t('stats.total')}</Text>
              <Text style={styles.statValuePrimary}>{stats.total}</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.statCard}>
              <Text style={styles.statLabel}>{t('stats.done')}</Text>
              <Text style={styles.statValueGreen}>{stats.done}</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statCard}>
              <Text style={styles.statLabel}>{t('stats.inProgress')}</Text>
              <Text style={styles.statValueAmber}>{stats.in_progress}</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.statCard}>
              <Text style={styles.statLabel}>{t('stats.highPriority')}</Text>
              <Text style={styles.statValueRed}>{stats.high}</Text>
            </Animated.View>
          </View>

          <View style={styles.progSection}>
            <Text style={styles.progSectionTitle}>{t('stats.byStatus')}</Text>
            <ProgressRow
              label={t('taskStatus.todo')}
              count={stats.todo}
              pct={stats.pct.todo}
              color={styles.progressTodo}
              delay={200}
            />
            <ProgressRow
              label={t('taskStatus.in_progress')}
              count={stats.in_progress}
              pct={stats.pct.in_progress}
              color={styles.progressInProgress}
              delay={250}
            />
            <ProgressRow
              label={t('taskStatus.done')}
              count={stats.done}
              pct={stats.pct.done}
              color={styles.progressDone}
              delay={300}
            />
          </View>

          <View style={styles.progSection}>
            <Text style={styles.progSectionTitle}>{t('stats.byPriority')}</Text>
            <ProgressRow
              label={t('taskPriority.high')}
              count={stats.high}
              pct={stats.pct.high}
              color={styles.progressHigh}
              delay={350}
            />
            <ProgressRow
              label={t('taskPriority.medium')}
              count={stats.medium}
              pct={stats.pct.medium}
              color={styles.progressMedium}
              delay={400}
            />
            <ProgressRow
              label={t('taskPriority.low')}
              count={stats.low}
              pct={stats.pct.low}
              color={styles.progressLow}
              delay={450}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
