import { configureStore, type Middleware } from '@reduxjs/toolkit';

import { tasksActions, tasksReducer, type TasksState } from '@/store/tasks/tasksSlice';

export type TestRootState = {
  tasks: TasksState;
};

const fetchTasksMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    if (tasksActions.fetchTasksRequest.match(action)) {
      const items = (store.getState() as TestRootState).tasks.items;
      store.dispatch(tasksActions.fetchTasksSuccess(items));
    }
    return result;
  };

export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: preloadedState as TestRootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(fetchTasksMiddleware),
  });
}
