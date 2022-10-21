import { COLORS } from '@colors/colors';
import { FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome';
import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export type WithAuthNavigationStylesType = {
  header: ViewStyle;
  headerTitleStyle: TextStyle;
  tabBarContainer: ViewStyle;
  tabFocusIcon: FontAwesomeIconStyle;
  tabIcon: FontAwesomeIconStyle;
  buttonContainer: ViewStyle;
  icon: TextStyle;
  title: TextStyle;
};

const iOSHeaderHeight = 90;
const androidHeaderHeight = 50;
const iOSTabBarContainerHeight = 82;
const androidTabBarContainerHeight = 50;

const { CORNFLOWER_BLUE, WHITE, BLACK } = COLORS;

export const styles = StyleSheet.create<WithAuthNavigationStylesType>({
  header: {
    backgroundColor: CORNFLOWER_BLUE,
    height: Platform.OS === 'ios' ? iOSHeaderHeight : androidHeaderHeight,
  },

  headerTitleStyle: {
    color: COLORS.WHITE,
    fontSize: 22,
  },

  tabBarContainer: {
    height:
      Platform.OS === 'ios' ? iOSTabBarContainerHeight : androidTabBarContainerHeight,
    backgroundColor: CORNFLOWER_BLUE,
    borderTopWidth: 0,
  },

  tabFocusIcon: {
    color: WHITE,
  },

  tabIcon: {
    color: BLACK,
  },

  buttonContainer: {
    marginRight: 12,
  },

  icon: {
    marginTop: 5,
  },

  title: {
    fontSize: 14,
    marginBottom: 2,
  },
});
