import React from 'react';

import { MAP, SETTINGS } from '@constants/constants';
import {
  settingsScreenOptions,
  mapScreenOptions,
  withAuthNavigatorOptions,
} from '@navigation/withAuthNavigator/settings';
import {
  BottomTabParamList,
  withAuthNavigatorScreens,
} from '@navigation/withAuthNavigator/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '@screens/mapScreen/MapScreen';
import { SettingsScreen } from '@screens/settingsScreen/SettingsScreen';

const { Navigator, Screen } = createBottomTabNavigator<BottomTabParamList>();

export const WithAuthNavigator = () => {
  return (
    <Navigator
      initialRouteName={withAuthNavigatorScreens.SETTINGS}
      screenOptions={withAuthNavigatorOptions()}
    >
      <Screen
        component={MapScreen}
        name={withAuthNavigatorScreens.MAP}
        options={{
          ...mapScreenOptions(),
          headerTitle: MAP,
          tabBarLabel: MAP,
        }}
      />
      <Screen
        component={SettingsScreen}
        name={withAuthNavigatorScreens.SETTINGS}
        options={{
          ...settingsScreenOptions(),
          headerTitle: SETTINGS,
          tabBarLabel: SETTINGS,
        }}
      />
    </Navigator>
  );
};
