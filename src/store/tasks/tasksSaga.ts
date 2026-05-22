import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import type { Task, TaskDraft } from '@/domain/types/task';
import i18n from '@/i18n';
import { initializeDatabase } from '@/infrastructure/database/client';
import * as taskRepo from '@/infrastructure/database/taskRepository';
import { getPendingSyncCount, enqueueSync } from '@/infrastructure/sync/syncQueue';
import { isOnline, processSyncQueue } from '@/infrastructure/sync/syncService';
import { tasksActions } from './tasksSlice';

function* refreshPendingCount() {
  const count: number = yield call(getPendingSyncCount);
  yield put(tasksActions.setPendingSyncCount(count));
}

function* loadTasksFromDatabase() {
  yield call(initializeDatabase);
  const tasks: Task[] = yield call(taskRepo.fetchAllTasks);
  yield put(tasksActions.fetchTasksSuccess(tasks));
  yield* refreshPendingCount();
}

function* handleFetchTasks() {
  try {
    yield* loadTasksFromDatabase();
  } catch (error) {
    const message = error instanceof Error ? error.message : i18n.t('errors.loadTasks');
    yield put(tasksActions.fetchTasksFailure(message));
  }
}

function* handleCreateTask(action: PayloadAction<TaskDraft>) {
  const draft = action.payload;
  const optimisticId = draft.id;
  try {
    const task: Task = yield call(taskRepo.insertTask, draft, optimisticId);
    yield call(enqueueSync, task.id, 'create', { ...task });
    yield put(tasksActions.persistTaskSuccess(task));
    yield* refreshPendingCount();
    if (isOnline()) {
      yield put(tasksActions.syncRequest());
    }
  } catch (error) {
    yield put(tasksActions.rollbackOptimistic());
    const message = error instanceof Error ? error.message : i18n.t('errors.createTask');
    yield put(tasksActions.fetchTasksFailure(message));
  }
}

function* handleUpdateTask(
  action: PayloadAction<{ id: string; draft: Partial<TaskDraft> }>,
) {
  const { id, draft } = action.payload;
  try {
    const task: Task = yield call(taskRepo.updateTask, id, draft);
    yield call(enqueueSync, id, 'update', { ...task });
    yield put(tasksActions.persistTaskSuccess(task));
    yield put(tasksActions.confirmOptimistic());
    yield* refreshPendingCount();
    if (isOnline()) {
      yield put(tasksActions.syncRequest());
    }
  } catch (error) {
    yield put(tasksActions.rollbackOptimistic());
    const message = error instanceof Error ? error.message : i18n.t('errors.updateTask');
    yield put(tasksActions.fetchTasksFailure(message));
  }
}

function* handleDeleteTask(action: PayloadAction<string>) {
  const id = action.payload;
  try {
    yield call(taskRepo.deleteTask, id);
    yield call(enqueueSync, id, 'delete', { id });
    yield put(tasksActions.removeTaskSuccess(id));
    yield put(tasksActions.confirmOptimistic());
    yield* refreshPendingCount();
    if (isOnline()) {
      yield put(tasksActions.syncRequest());
    }
  } catch (error) {
    yield put(tasksActions.rollbackOptimistic());
    const message = error instanceof Error ? error.message : i18n.t('errors.deleteTask');
    yield put(tasksActions.fetchTasksFailure(message));
  }
}

function* handleSync() {
  try {
    const result: { synced: number; failed: number } = yield call(processSyncQueue);
    const count: number = yield call(getPendingSyncCount);
    yield put(tasksActions.syncSuccess(count));
    if (result.failed > 0) {
      yield put(
        tasksActions.fetchTasksFailure(
          i18n.t('errors.syncPartial', { count: result.failed }),
        ),
      );
    }
    const tasks: Task[] = yield call(taskRepo.fetchAllTasks);
    yield put(tasksActions.fetchTasksSuccess(tasks));
  } catch (error) {
    const message = error instanceof Error ? error.message : i18n.t('errors.syncFailed');
    yield put(tasksActions.syncFailure(message));
  }
}

function* handleReorderTasks(action: PayloadAction<string[]>) {
  try {
    const tasks: Task[] = yield call(taskRepo.reorderTasks, action.payload);
    yield put(tasksActions.fetchTasksSuccess(tasks));
  } catch (error) {
    const message = error instanceof Error ? error.message : i18n.t('errors.reorderTasks');
    yield put(tasksActions.reorderTasksFailure(message));
    yield* loadTasksFromDatabase();
  }
}

export function* watchTasks() {
  yield takeLatest(tasksActions.fetchTasksRequest.type, handleFetchTasks);
  yield takeEvery(tasksActions.createTaskOptimistic.type, handleCreateTask);
  yield takeEvery(tasksActions.updateTaskOptimistic.type, handleUpdateTask);
  yield takeEvery(tasksActions.deleteTaskOptimistic.type, handleDeleteTask);
  yield takeLatest(tasksActions.syncRequest.type, handleSync);
  yield takeLatest(tasksActions.reorderTasks.type, handleReorderTasks);
}

export function updateTaskStatus(id: string, status: Task['status']) {
  return tasksActions.updateTaskOptimistic({ id, draft: { status } });
}
