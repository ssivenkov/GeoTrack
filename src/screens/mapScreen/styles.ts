import { COLORS } from '@colors/colors';
import { POLYLINE_COLOR } from '@screens/mapScreen/colors';
import { StyleSheet, ViewStyle } from 'react-native';

type MapScreenStylesType = {
  mapScreenContainer: ViewStyle;
  mapView: ViewStyle;
  stopZoneMarker: ViewStyle;
  markerIcon: ViewStyle;
  geofenceHitMarker: ViewStyle;
};

const { RED, RED_ORANGE, BLACK } = COLORS;

export const styles = StyleSheet.create<MapScreenStylesType>({
  mapScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  mapView: {
    ...StyleSheet.absoluteFillObject,
  },

  stopZoneMarker: {
    borderWidth: 1,
    borderColor: RED,
    backgroundColor: RED_ORANGE,
    opacity: 0.2,
    borderRadius: 15,
    zIndex: 0,
    width: 30,
    height: 30,
  },

  markerIcon: {
    borderWidth: 1,
    borderColor: BLACK,
    backgroundColor: POLYLINE_COLOR,
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  geofenceHitMarker: {
    borderWidth: 1,
    borderColor: BLACK,
    borderRadius: 6,
    zIndex: 10,
    width: 12,
    height: 12,
  },
});
