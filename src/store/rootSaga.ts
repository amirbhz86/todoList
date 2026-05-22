import { all, fork } from 'redux-saga/effects';

import { watchTasks } from './tasks/tasksSaga';

export function* rootSaga() {
  yield all([fork(watchTasks)]);
}
