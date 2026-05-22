import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import { useFabStyles } from "@/components/ui/useStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NAV_HEIGHT = 64;

type FABProps = {
  onPress: () => void;
};

export function FAB({ onPress }: FABProps) {
  const styles = useFabStyles();
  const { motion, semantic } = useMaterialTheme();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      testID="tasks-new-button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.91, motion.springBouncy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.springBouncy);
      }}
      style={[
        styles.pressable,
        {
          bottom: 18,
        },
        animatedStyle,
      ]}
    >
      <TaskFlowIcon name="plus" size={22} color="#fff" strokeWidth={2.5} />
    </AnimatedPressable>
  );
}
