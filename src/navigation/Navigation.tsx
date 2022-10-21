import React from 'react';

import { RootStackParamList, RootStackScreens } from '@navigation/types';
import { WithAuthNavigator } from '@navigation/withAuthNavigator/WithAuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@screens/signInScreen/SignInScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const userID = true;

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
