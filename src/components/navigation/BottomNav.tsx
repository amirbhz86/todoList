import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TaskFlowIcon, type TaskFlowIconName } from '@/components/icons/TaskFlowIcon';
import { useBottomNavStyles } from '@/components/navigation/useStyles';
import { useMaterialTheme } from '@/theme/ThemeProvider';

const TAB_ICONS: Record<string, TaskFlowIconName> = {
  index: 'tasks',
  board: 'board',
  stats: 'stats',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NavItem({
  label,
  icon,
  focused,
  onPress,
}: {
  label: string;
  icon: TaskFlowIconName;
  focused: boolean;
  onPress: () => void;
}) {
  const styles = useBottomNavStyles();
  const { semantic, motion } = useMaterialTheme();
  const lift = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    lift.value = withSpring(focused ? -2 : 0, motion.springBouncy);
  }, [focused, lift, motion.springBouncy]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
  }));

  return (
    <AnimatedPressable onPress={onPress} style={styles.navBtn}>
      <Animated.View style={iconAnim}>
        <TaskFlowIcon
          name={icon}
          size={22}
          color={focused ? semantic.blue : semantic.textMuted}
          strokeWidth={1.8}
        />
      </Animated.View>
      <Text style={[styles.navLabel, focused && styles.navLabelActive]}>{label}</Text>
    </AnimatedPressable>
  );
}

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useBottomNavStyles();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        return (
          <NavItem
            key={route.key}
            label={label}
            icon={TAB_ICONS[route.name] ?? 'tasks'}
            focused={focused}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
          />
        );
      })}
    </View>
  );
}
