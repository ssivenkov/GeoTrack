import { ComputeOffsetCoordinateReturnType } from '@lib/react-native-background-geolocation/GeoMath';
import { LatLng, Region } from 'react-native-maps/lib/sharedTypes';

export type MapCenterType = Region;
export type CoordinatesType = LatLng;

export type StopZoneType = {
  coordinate: CoordinatesType;
  key: string;
};

export type MarkerType = {
  coordinate: CoordinatesType;
  key: string;
  title: string;

  heading?: number;
};

type TriggeredGeofenceEventMarkerCoordinatesType = {
  computedCoordinates: ComputeOffsetCoordinateReturnType;
  coordinates: CoordinatesType;
};

export type TriggeredGeofenceEventMarkerType = {
  action: string;
  coordinates: TriggeredGeofenceEventMarkerCoordinatesType;
  key: string;
};

export type GeofenceType = {
  identifier: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;

  fillColor?: string;
  strokeColor?: string;
};

export type TriggeredGeofenceType = GeofenceType & {
  events: any[];
};
