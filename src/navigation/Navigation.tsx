import React, { useEffect, useState } from 'react';

import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { RootStackParamList, RootStackScreens } from '@navigation/types';
import { WithAuthNavigator } from '@navigation/withAuthNavigator/WithAuthNavigator';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@screens/signInScreen/SignInScreen';
import { checkUserAction } from '@store/actions/userSagaActions/checkUserAction';
import { getUserDataAction } from '@store/actions/userSagaActions/getUserDataAction';
import { UserDataType } from '@store/reducers/userReducer/types';
import { userIDSelector } from '@store/selectors/userSelectors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const dispatch = useDispatch();

  const userID = useSelector(userIDSelector);

  const [firebaseInitializing, setFirebaseInitializing] = useState<boolean>(true);

  useEffect(() => {
    if (userID) {
      dispatch(checkUserAction());
    }
  }, [userID]);

  useEffect(() => {
    const onAuthStateChanged = (userData: UserDataType) => {
      dispatch(getUserDataAction({ userData }));

      if (firebaseInitializing) {
        setFirebaseInitializing(false);
      }
    };

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });

    // subscriber
    return auth().onAuthStateChanged((user) => onAuthStateChanged(user));
  }, []);

  if (firebaseInitializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigator>
          {userID ? (
            <Screen
              component={WithAuthNavigator}
              name={RootStackScreens.WITH_AUTH}
              options={{ headerShown: false }}
            />
          ) : (
            <Screen
              component={SignInScreen}
              name={RootStackScreens.SIGN_IN}
              options={{ headerShown: false }}
            />
          )}
        </Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
