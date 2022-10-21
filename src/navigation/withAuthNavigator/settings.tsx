import React from 'react';

import { COLORS } from '@colors/colors';
import { ICON_SIZE_HALF_MEDIUM, MAP, SETTINGS } from '@constants/constants';
import { faMap, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from '@navigation/withAuthNavigator/styles';
import { WithAuthNavigatorOptionsType } from '@navigation/withAuthNavigator/types';

const { WHITE, BLACK } = COLORS;

export const withAuthNavigatorOptions: WithAuthNavigatorOptionsType = () => {
  return {
    headerShown: false,
    tabBarStyle: styles.tabBarContainer,
    tabBarActiveTintColor: WHITE,
    tabBarInactiveTintColor: BLACK,
    tabBarIconStyle: styles.icon,
    tabBarLabelStyle: styles.title,
  };
};

export const mapScreenOptions: WithAuthNavigatorOptionsType = () => {
  return {
    headerShown: true,
    headerStyle: styles.header,
    headerTitle: MAP,
    headerTitleStyle: styles.headerTitleStyle,
    headerTitleAlign: 'center',
    tabBarLabel: MAP,
    tabBarIcon: ({ focused }) => (
      <FontAwesomeIcon
        icon={faMap}
        size={ICON_SIZE_HALF_MEDIUM}
        style={focused ? styles.tabFocusIcon : styles.tabIcon}
      />
    ),
  };
};

export const settingsScreenOptions: WithAuthNavigatorOptionsType = () => {
  return {
    headerShown: true,
    headerStyle: styles.header,
    headerTitle: SETTINGS,
    headerTitleStyle: styles.headerTitleStyle,
    headerTitleAlign: 'center',
    tabBarLabel: SETTINGS,
    tabBarIcon: ({ focused }) => (
      <FontAwesomeIcon
        icon={faUserGear}
        size={ICON_SIZE_HALF_MEDIUM}
        style={focused ? styles.tabFocusIcon : styles.tabIcon}
      />
    ),
  };
};
