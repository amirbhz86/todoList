import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TaskFlowSheetHandle } from '@/components/sheets/TaskFlowSheetLayout';
import { useTaskFlowSheetStyles } from '@/components/sheets/useStyles';

export type TaskFlowBottomSheetRef = BottomSheetModal;

type TaskFlowBottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  enableDynamicSizing?: boolean;
  scrollable?: boolean;
  /** Lifts the sheet when the keyboard is open (use on forms with text inputs). */
  keyboardAware?: boolean;
  /** When true, keyboard height is handled via snap points (e.g. useSheetKeyboardHeight). */
  keyboardSnapManaged?: boolean;
  onDismiss?: () => void;
  onChange?: (index: number) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const TaskFlowBottomSheet = forwardRef<BottomSheetModal, TaskFlowBottomSheetProps>(
  function TaskFlowBottomSheet(
    {
      children,
      snapPoints: snapPointsProp,
      enableDynamicSizing = false,
      scrollable = true,
      keyboardAware = false,
      keyboardSnapManaged = false,
      onDismiss,
      onChange,
      contentContainerStyle,
    },
    ref,
  ) {
    const styles = useTaskFlowSheetStyles();
    const snapPoints = useMemo(
      () => snapPointsProp ?? (enableDynamicSizing ? undefined : ['50%']),
      [enableDynamicSizing, snapPointsProp],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.65}
          pressBehavior="close"
        />
      ),
      [],
    );

    const body = scrollable ? (
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, contentContainerStyle]}>
        {children}
      </BottomSheetScrollView>
    ) : (
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        keyboardBehavior={
          keyboardSnapManaged ? undefined : keyboardAware ? 'interactive' : undefined
        }
        keyboardBlurBehavior={
          keyboardSnapManaged ? undefined : keyboardAware ? 'restore' : undefined
        }
        android_keyboardInputMode={
          keyboardAware || keyboardSnapManaged ? 'adjustResize' : undefined
        }
        backdropComponent={renderBackdrop}
        handleComponent={TaskFlowSheetHandle}
        backgroundStyle={styles.background}
        enablePanDownToClose
        onDismiss={onDismiss}
        onChange={onChange}>
        {body}
      </BottomSheetModal>
    );
  },
);
