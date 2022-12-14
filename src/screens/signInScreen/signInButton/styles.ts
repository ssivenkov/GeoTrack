import { COLORS } from '@colors/colors';
import { FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type CustomButtonStylesType = {
  button: ViewStyle;
  disabled: ViewStyle;
  icon: FontAwesomeIconStyle;
  text: TextStyle;
  googleStyle: ViewStyle;
};

const { WHITE, CORNFLOWER_BLUE, DUSTY_GRAY } = COLORS;

export const signInStyles = StyleSheet.create<CustomButtonStylesType>({
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
  },

  icon: {
    marginRight: 15,
    marginLeft: 5,
    color: WHITE,
  },

  text: {
    fontSize: 22,
    color: WHITE,
  },

  googleStyle: {
    backgroundColor: CORNFLOWER_BLUE,
  },

  disabled: {
    backgroundColor: DUSTY_GRAY,
  },
});
