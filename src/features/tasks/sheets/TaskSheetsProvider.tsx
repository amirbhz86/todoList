import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SettingsSheet } from '@/features/settings/sheets/SettingsSheet';
import { FilterSheet } from '@/features/tasks/components/FilterSheet';
import { TaskFormSheet } from '@/features/tasks/sheets/TaskFormSheet';

type TaskSheetsContextValue = {
  openFilterSheet: () => void;
  openSettingsSheet: () => void;
  openTaskForm: (taskId?: string) => void;
};

const TaskSheetsContext = createContext<TaskSheetsContextValue | null>(null);

export function useTaskSheets(): TaskSheetsContextValue {
  const ctx = useContext(TaskSheetsContext);
  if (!ctx) {
    throw new Error('useTaskSheets must be used within TaskSheetsProvider');
  }
  return ctx;
}

export function TaskSheetsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const filterRef = useRef<BottomSheetModal>(null);
  const settingsRef = useRef<BottomSheetModal>(null);
  const formRef = useRef<BottomSheetModal>(null);

  const [formTaskId, setFormTaskId] = useState<string | undefined>();

  const openFilterSheet = useCallback(() => {
    filterRef.current?.present();
  }, []);

  const openSettingsSheet = useCallback(() => {
    queueMicrotask(() => settingsRef.current?.present());
  }, []);

  const openTaskForm = useCallback((taskId?: string) => {
    setFormTaskId(taskId);
    queueMicrotask(() => formRef.current?.present());
  }, []);

  const value = useMemo(
    () => ({ openFilterSheet, openSettingsSheet, openTaskForm }),
    [openFilterSheet, openSettingsSheet, openTaskForm],
  );

  return (
    <TaskSheetsContext.Provider value={value}>
      {children}
      <FilterSheet sheetRef={filterRef} />
      <SettingsSheet sheetRef={settingsRef} />
      <TaskFormSheet
        sheetRef={formRef}
        taskId={formTaskId}
        onDismiss={() => setFormTaskId(undefined)}
      />
    </TaskSheetsContext.Provider>
  );
}
