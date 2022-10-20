import React from 'react';

import { RootStackParamList, RootStackScreens } from '@navigation/types';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@screens/signInScreen/SignInScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigator>
          <Screen
            component={SignInScreen}
            name={RootStackScreens.SIGN_IN}
            options={{ headerShown: false }}
          />
        </Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
