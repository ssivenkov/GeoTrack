import { COLORS } from '@colors/colors';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type UserScreenStylesType = {
  screenContainer: ViewStyle;
  userInfoContainer: ViewStyle;
  avatar: ImageStyle;
  name: TextStyle;
  text: TextStyle;
};

const avatarSize = 100;

export const styles = StyleSheet.create<UserScreenStylesType>({
  screenContainer: {
    alignItems: 'center',
    marginHorizontal: 1,
  },

  userInfoContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: COLORS.BLACK,
  },

  name: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginTop: 20,
    marginBottom: 5,
  },

  text: {
    fontSize: 18,
    color: COLORS.BLACK,
  },
});
