import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTasksSearchBarStyles } from '@/features/tasks/components/useStyles';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTaskFilters } from '@/store/tasks/selectors';
import { tasksActions } from '@/store/tasks/tasksSlice';
import { useMaterialTheme } from '@/theme/ThemeProvider';

type TasksSearchBarProps = {
  searchOpen: boolean;
};

export function TasksSearchBar({ searchOpen }: TasksSearchBarProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectTaskFilters);
  const styles = useTasksSearchBarStyles();
  const { semantic } = useMaterialTheme();

  const height = useSharedValue(searchOpen ? 56 : 0);
  const opacity = useSharedValue(searchOpen ? 1 : 0);

  React.useEffect(() => {
    height.value = withTiming(searchOpen ? 56 : 0, { duration: 280 });
    opacity.value = withTiming(searchOpen ? 1 : 0, { duration: 200 });
  }, [height, opacity, searchOpen]);

  const searchAnim = useAnimatedStyle(() => ({
    maxHeight: height.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.searchWrap, searchAnim]}>
      <View style={styles.searchInner}>
        <TextInput
          testID="tasks-search-input"
          placeholder={t('tasks.searchPlaceholder')}
          placeholderTextColor={semantic.textMuted}
          value={filters.search}
          onChangeText={(search) => dispatch(tasksActions.setFilters({ search }))}
          style={styles.searchInput}
        />
      </View>
    </Animated.View>
  );
}
