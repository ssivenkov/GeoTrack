import BackgroundGeolocation, {
  Config,
} from '@lib/react-native-background-geolocation/react-native-background-geolocation';

export const backgroundGeolocationReadyConfig: Config = {
  // Debug
  reset: false,
  debug: true, // enable sounds for background-geolocation life-cycle
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  // Geolocation
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
  distanceFilter: 10,
  stopTimeout: 5,
  // Permissions
  locationAuthorizationRequest: 'Always',
  backgroundPermissionRationale: {
    title:
      "Allow GeoTrack application to access this device's location even when closed or not in use.",
    message:
      'This app collects location data to enable recording your trips to work and calculate distance-travelled.',
    positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
    negativeAction: 'Cancel',
  },
  // HTTP & Persistence
  maxDaysToPersist: 14,
  // Application
  stopOnTerminate: false, // Allow the background-service to continue tracking when user closes the app
  startOnBoot: true, // Auto start tracking when device is powered-up.
  // HTTP / SQLite config
  // url: 'http://yourserver.com/locations'
  batchSync: false, // [Default: false] Set true to sync locations to server in a single HTTP request
  autoSync: true, // [Default: true] Set true to sync each location to server as it arrives
  enableHeadless: true,
  headers: {
    // Optional HTTP headers
    // 'X-FOO': 'bar',
  },
  params: {
    // Optional HTTP params
    // auth_token: 'maybe_your_server_authenticates_via_token_YES?',
  },
};
