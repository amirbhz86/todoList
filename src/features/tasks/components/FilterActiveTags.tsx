import React, { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import type { TaskPriority, TaskStatus } from "@/domain/types/task";
import { useFilterActiveTagsStyles } from "@/features/tasks/components/useStyles";
import { taskPriorityLabel, taskStatusLabel } from "@/i18n/labels";
import { usePreferences } from "@/preferences/PreferencesProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTaskFilters } from "@/store/tasks/selectors";
import { tasksActions } from "@/store/tasks/tasksSlice";
import { useMaterialTheme } from "@/theme/ThemeProvider";
import { hasSheetFilters } from "@/utils/taskFilters";

function FilterTag({
  label,
  dotColor,
  onRemove,
  testID,
}: {
  label: string;
  dotColor?: string;
  onRemove: () => void;
  testID?: string;
}) {
  const styles = useFilterActiveTagsStyles();
  const { semantic } = useMaterialTheme();

  return (
    <Pressable
      onPress={onRemove}
      style={styles.tag}
      accessibilityRole="button"
      testID={
        testID ??
        (dotColor ? "filter-active-tag-priority" : "filter-active-tag-status")
      }
    >
      {dotColor ? (
        <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />
      ) : null}
      <Text style={styles.tagLabel}>{label}</Text>
      <TaskFlowIcon
        name="close"
        size={10}
        color={semantic.textSecondary}
        strokeWidth={2.5}
      />
    </Pressable>
  );
}

export function FilterActiveTags() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectTaskFilters);
  const styles = useFilterActiveTagsStyles();
  const { semantic } = useMaterialTheme();
  const { language, isRtl } = usePreferences();

  const scrollRef = useRef<ScrollView | null>(null);
  const needsLanguageScrollRef = useRef(false);
  const hasActiveFilters = hasSheetFilters(filters);

  const applyLanguageScroll = useCallback(
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

  const setScrollViewRef = useCallback(
    (node: ScrollView | null) => {
      scrollRef.current = node;
      if (node && needsLanguageScrollRef.current) {
        requestAnimationFrame(() => {
          if (applyLanguageScroll(false)) {
            needsLanguageScrollRef.current = false;
          }
        });
      }
    },
    [applyLanguageScroll],
  );

  useLayoutEffect(() => {
    if (!hasActiveFilters) {
      needsLanguageScrollRef.current = false;
      return;
    }

    needsLanguageScrollRef.current = true;

    if (applyLanguageScroll(false)) {
      needsLanguageScrollRef.current = false;
      return;
    }

    requestAnimationFrame(() => {
      if (applyLanguageScroll(true)) {
        needsLanguageScrollRef.current = false;
      }
    });
  }, [language, hasActiveFilters, applyLanguageScroll]);

  const handleContentSizeChange = useCallback(() => {
    if (!needsLanguageScrollRef.current) {
      return;
    }
    if (applyLanguageScroll(false)) {
      needsLanguageScrollRef.current = false;
    }
  }, [applyLanguageScroll]);

  if (!hasActiveFilters) {
    return null;
  }

  const removeStatus = (status: TaskStatus) => {
    dispatch(
      tasksActions.setFilters({
        statuses: filters.statuses.filter((s) => s !== status),
      }),
    );
  };

  const removePriority = (priority: TaskPriority) => {
    dispatch(
      tasksActions.setFilters({
        priorities: filters.priorities.filter((p) => p !== priority),
      }),
    );
  };

  return (
    <ScrollView
      ref={setScrollViewRef}
      horizontal
      style={styles.scroll}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.bar}
      onContentSizeChange={handleContentSizeChange}
    >
      {filters.statuses.map((status) => (
        <FilterTag
          key={`status-${status}`}
          label={taskStatusLabel(t, status)}
          testID={`filter-active-tag-status-${status}`}
          onRemove={() => removeStatus(status)}
        />
      ))}
      {filters.priorities.map((priority) => (
        <FilterTag
          key={`priority-${priority}`}
          label={taskPriorityLabel(t, priority)}
          dotColor={
            priority === "high"
              ? semantic.red
              : priority === "medium"
                ? semantic.amber
                : semantic.green
          }
          onRemove={() => removePriority(priority)}
        />
      ))}
    </ScrollView>
  );
}
