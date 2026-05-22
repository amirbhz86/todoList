import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useChipStyles } from "@/components/ui/useStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ChipTone =
  | "blue"
  | "amber"
  | "green"
  | "red"
  | "purple"
  | "default";

type ChipProps = {
  label: string;
  selected?: boolean;
  count?: number;
  tone?: ChipTone;
  /** Chip position in a row; index 0 skips `layout.chip` margins. */
  index?: number;
  onPress?: () => void;
};

export function Chip({
  label,
  selected,
  count,
  tone = "default",
  index = 0,
  onPress,
}: ChipProps) {
  const styles = useChipStyles(selected, tone, index);
  const { motion } = useMaterialTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.94, motion.spring);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.spring);
      }}
      style={styles.withAnimated(animatedStyle)}
    >
      <Text style={styles.label}>{label}</Text>
      {count !== undefined ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}
