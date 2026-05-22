import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import type { Task } from '@/domain/types/task';
import type { useBoardScreenStyles } from '@/features/board/screens/useStyles';
import { PriorityIndicator } from '@/features/tasks/components/PriorityIndicator';
import { useFormatRelativeDate } from '@/utils/formatDate';

type BoardDraggableCardProps = {
  task: Task;
  onPress: () => void;
  onDragStart: (task: Task, x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  isDragging: boolean;
  dragEnabled: boolean;
  styles: ReturnType<typeof useBoardScreenStyles>;
};

function BoardCardContent({
  task,
  styles,
}: {
  task: Task;
  styles: ReturnType<typeof useBoardScreenStyles>;
}) {
  const formatRelativeDate = useFormatRelativeDate();
  const done = task.status === 'done';

  return (
    <>
      <View
        style={[
          styles.cardStripe,
          task.priority === 'high'
            ? styles.stripe_high
            : task.priority === 'medium'
              ? styles.stripe_medium
              : styles.stripe_low,
        ]}
      />
      <Text style={[styles.cardTitle, done && styles.cardTitleDone]} numberOfLines={2}>
        {task.title}
      </Text>
      <View style={styles.cardMeta}>
        <PriorityIndicator priority={task.priority} compact />
        <Text style={styles.cardDate}>{formatRelativeDate(task.createdAt)}</Text>
      </View>
    </>
  );
}

export function BoardDraggableCard({
  task,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDragging,
  dragEnabled,
  styles,
}: BoardDraggableCardProps) {
  if (!dragEnabled) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <BoardCardContent task={task} styles={styles} />
      </Pressable>
    );
  }

  const pan = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((event) => {
      runOnJS(onDragStart)(task, event.absoluteX, event.absoluteY);
    })
    .onUpdate((event) => {
      runOnJS(onDragMove)(event.absoluteX, event.absoluteY);
    })
    .onFinalize((event) => {
      runOnJS(onDragEnd)(event.absoluteX, event.absoluteY);
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.card, isDragging && styles.cardDragging]}>
        <BoardCardContent task={task} styles={styles} />
      </View>
    </GestureDetector>
  );
}

/** Floating preview while dragging between columns. */
export function BoardDragGhost({
  task,
  x,
  y,
  width,
  styles,
}: {
  task: Task;
  x: number;
  y: number;
  width: number;
  styles: ReturnType<typeof useBoardScreenStyles>;
}) {
  if (Platform.OS === 'web') return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.dragGhost,
        {
          left: x - width / 2,
          top: y - 28,
          width: width - 20,
        },
      ]}>
      <View style={styles.card}>
        <BoardCardContent task={task} styles={styles} />
      </View>
    </View>
  );
}
