import { ONLINE, START_ANIMATION_DELAY } from '@constants/constants';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { checkInternetConnectionHelper } from '@root/helpers/checkInternetConnectionHelper';
import { setAuthStateAction } from '@store/actions/userReducerActions/setAuthStateAction';
import { SignOutSagaActionReturnType } from '@store/actions/userSagaActions/signOutAction';
import { call, delay, put } from 'redux-saga/effects';

export function* signOutSaga(action: SignOutSagaActionReturnType) {
  const setWaitingProcess = action.payload.setWaitingProcess;

  const internetConnectionStatus: string = yield call(checkInternetConnectionHelper);

  if (internetConnectionStatus !== ONLINE) {
    throw Error(internetConnectionStatus);
  }

  yield call(setWaitingProcess, true);
  yield delay(START_ANIMATION_DELAY);

  const signOut = () => {
    return auth().signOut();
  };

  yield delay(START_ANIMATION_DELAY);
  yield call(signOut);
  yield call(GoogleSignin.signOut);

  yield put(
    setAuthStateAction({
      userData: null,
      providerID: null,
      isUserDataSynchronized: false,
    }),
  );
}
