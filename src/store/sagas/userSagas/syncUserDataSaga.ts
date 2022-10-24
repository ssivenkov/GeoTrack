import { ONLINE, USERS } from '@constants/constants';
import { DB } from '@root/api/DB';
import { checkInternetConnectionHelper } from '@root/helpers/checkInternetConnectionHelper';
import { setGlobalLoaderAction } from '@store/actions/userReducerActions/setGlobalLoaderAction';
import { setIsUserDataSynchronizedAction } from '@store/actions/userReducerActions/setIsUserDataSynchronizedAction';
import { SnapshotType, UserIDType } from '@store/reducers/userReducer/types';
import { userIDSelector } from '@store/selectors/userSelectors';
import { call, put, select } from 'redux-saga/effects';

export function* syncUserDataSaga() {
  const internetConnectionStatus: string = yield call(checkInternetConnectionHelper);

  if (internetConnectionStatus !== ONLINE) {
    throw Error(internetConnectionStatus);
  }

  yield put(setGlobalLoaderAction({ globalLoader: true }));

  const userID: UserIDType = yield select(userIDSelector);
  const snapshot: SnapshotType = yield DB.ref(`${USERS}/${userID}`).once('value');
  const userData = snapshot.val() && snapshot.val();

  yield put(setIsUserDataSynchronizedAction({ isUserDataSynchronized: true }));
  yield put(setGlobalLoaderAction({ globalLoader: false }));
}
