import { StyleSheet, ViewStyle } from 'react-native';

type MapScreenStylesType = {
  container: ViewStyle;
  map: ViewStyle;
};

export const styles = StyleSheet.create<MapScreenStylesType>({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
