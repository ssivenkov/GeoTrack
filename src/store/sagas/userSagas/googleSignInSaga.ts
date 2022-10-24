import { GOOGLE_PROVIDER_ID, ONLINE, START_ANIMATION_DELAY } from '@constants/constants';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { checkInternetConnectionHelper } from '@root/helpers/checkInternetConnectionHelper';
import { setProviderIDAction } from '@store/actions/userReducerActions/setProviderIDAction';
import { GetGoogleUserDataSagaActionReturnType } from '@store/actions/userSagaActions/GoogleSignInAction';
import { call, delay, putResolve } from 'redux-saga/effects';

export type AuthCredentialType = {
  providerId: string;
  token: string;
  secret: string;
};

export function* googleSignInSaga(action: GetGoogleUserDataSagaActionReturnType) {
  const { setWaitingUserData } = action.payload;

  const internetConnectionStatus: string = yield call(checkInternetConnectionHelper);

  if (internetConnectionStatus !== ONLINE) {
    throw Error(internetConnectionStatus);
  }

  yield call(setWaitingUserData, true);
  yield delay(START_ANIMATION_DELAY);

  const { idToken } = yield call(GoogleSignin.signIn);

  if (!idToken) {
    throw Error('ErrorGettingAccessToken');
  }

  const googleCredential: AuthCredentialType = yield call(
    auth.GoogleAuthProvider.credential,
    idToken,
  );

  const providerID = GOOGLE_PROVIDER_ID;

  yield putResolve(setProviderIDAction({ providerID }));

  const signInWithCredential = (credential: AuthCredentialType) => {
    return auth().signInWithCredential(credential);
  };

  yield call(signInWithCredential, googleCredential);
}
