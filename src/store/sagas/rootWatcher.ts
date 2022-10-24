import { USER_SAGA_ACTION } from '@enums/userSagaEnum';
import { checkUserSaga } from '@store/sagas/userSagas/checkUserSaga';
import { deleteAccountSaga } from '@store/sagas/userSagas/deleteAccountSaga';
import { getUserDataSaga } from '@store/sagas/userSagas/getUserDataSaga';
import { googleSignInSaga } from '@store/sagas/userSagas/googleSignInSaga';
import { signOutSaga } from '@store/sagas/userSagas/signOutSaga';
import { syncUserDataSaga } from '@store/sagas/userSagas/syncUserDataSaga';
import { takeEvery, takeLatest } from 'redux-saga/effects';

export function* rootWatcher() {
  yield takeLatest(USER_SAGA_ACTION.GOOGLE_SIGN_IN, googleSignInSaga);
  yield takeLatest(USER_SAGA_ACTION.GET_USER_DATA, getUserDataSaga);
  yield takeLatest(USER_SAGA_ACTION.SIGN_OUT, signOutSaga);
  yield takeLatest(USER_SAGA_ACTION.DELETE_ACCOUNT, deleteAccountSaga);
  yield takeEvery(USER_SAGA_ACTION.CHECK_USER, checkUserSaga);
  yield takeLatest(USER_SAGA_ACTION.SYNC_USER_DATA, syncUserDataSaga);
}
