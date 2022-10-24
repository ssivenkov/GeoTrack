import { setUserAvatarAction } from '@store/actions/userReducerActions/setUserAvatarAction';
import { setUserDataAction } from '@store/actions/userReducerActions/setUserDataAction';
import { GetUserDataSagaActionReturnType } from '@store/actions/userSagaActions/getUserDataAction';
import { put } from 'redux-saga/effects';

export function* getUserDataSaga(action: GetUserDataSagaActionReturnType) {
  const { userData } = action.payload;

  const userAvatar = action.payload.userData?.photoURL ?? null;

  yield put(setUserAvatarAction({ userAvatar }));

  yield put(setUserDataAction({ userData }));
}
