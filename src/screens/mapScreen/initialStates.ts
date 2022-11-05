import {
  GeofencesChangeEvent,
  GeofenceEvent,
  Location,
} from '@lib/react-native-background-geolocation/react-native-background-geolocation';
import { MotionChangeEvent } from 'react-native-background-geolocation';

export const initialStationaryRadius = 200;
export const LATITUDE_DELTA = 0.00922;
export const LONGITUDE_DELTA = 0.00421;

const coordsInitialState: GeofenceEvent['location']['coords'] = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
};

const batteryInitialState: GeofenceEvent['location']['battery'] = {
  is_charging: false,
  level: 0,
};

const activityInitialState: GeofenceEvent['location']['activity'] = {
  activity: '',
  confidence: 0,
};

export const locationInitialState: Location = {
  timestamp: '',
  odometer: 0,
  is_moving: false,
  uuid: '',
  coords: coordsInitialState,
  battery: batteryInitialState,
  activity: activityInitialState,
};

export const geofenceEventInitialState: GeofenceEvent = {
  identifier: '',
  action: '',
  location: locationInitialState,
};

export const geofencesChangeEventInitialState: GeofencesChangeEvent = {
  on: [],
  off: [],
};

export const motionChangeEventInitialState: MotionChangeEvent = {
  isMoving: false,
  location: locationInitialState,
};

export const undefinedLocation = {
  timestamp: '',
  latitude: 0,
  longitude: 0,
};
