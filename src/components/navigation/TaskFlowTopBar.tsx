import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import {
  useIconButtonStyles,
  useTopBarStyles,
} from "@/components/navigation/useStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

type TaskFlowTopBarProps = {
  accentColor?: string;
  title: string;
  titleAccent?: string;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  searchActive?: boolean;
  filterActive?: boolean;
  searchTestID?: string;
  filterTestID?: string;
  rightSlot?: React.ReactNode;
};

function IconButton({
  active,
  onPress,
  icon,
  testID,
}: {
  active?: boolean;
  onPress?: () => void;
  icon: "search" | "filter";
  testID?: string;
}) {
  const styles = useIconButtonStyles(active);
  const { semantic } = useMaterialTheme();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={styles.btn}
      accessibilityRole="button"
    >
      <TaskFlowIcon
        name={icon}
        size={15}
        color={active ? semantic.blue : semantic.textSecondary}
        strokeWidth={2}
      />
    </Pressable>
  );
}

export function TaskFlowTopBar({
  accentColor,
  title,
  titleAccent,
  onSearchPress,
  onFilterPress,
  searchActive,
  filterActive,
  searchTestID,
  filterTestID,
  rightSlot,
}: TaskFlowTopBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useTopBarStyles();
  const { semantic } = useMaterialTheme();
  const logoBg = accentColor ?? semantic.blue;

  return (
    <View style={[styles.bar, { paddingTop: 14 + insets.top }]}>
      <View style={styles.logoRow}>
        <View style={[styles.logoIcon, { backgroundColor: logoBg }]}>
          <Text style={styles.logoText}>TF</Text>
        </View>
        <Text style={styles.logoName}>
          {title}
          {titleAccent ? (
            <Text style={styles.logoAccent}>{titleAccent}</Text>
          ) : null}
        </Text>
      </View>
      <View style={styles.actions}>
        {onSearchPress ? (
          <IconButton
            icon="search"
            active={searchActive}
            onPress={onSearchPress}
            testID={searchTestID}
          />
        ) : null}
        {onFilterPress ? (
          <IconButton
            icon="filter"
            active={filterActive}
            onPress={onFilterPress}
            testID={filterTestID}
          />
        ) : null}
        {rightSlot}
      </View>
    </View>
  );
}
