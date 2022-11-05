import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs/src/types';

export enum withAuthNavigatorScreens {
  MAP = 'Map',
  SETTINGS = 'Settings',
}

export type BottomTabParamList = {
  [K in withAuthNavigatorScreens]: undefined;
};

export type WithAuthNavigatorOptionsType = () => BottomTabNavigationOptions;
