import React, { ReactElement, useEffect, useState } from 'react';

import { COLORS } from '@colors/colors';
import {
  computeOffsetCoordinate,
  getBearing,
} from '@lib/react-native-background-geolocation/GeoMath';
import BackgroundGeolocation, {
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  Location,
  MotionChangeEvent,
  State,
  Subscription,
} from '@lib/react-native-background-geolocation/react-native-background-geolocation';
import notifee from '@notifee/react-native';
import { showNotification } from '@root/helpers/showNotification';
import { Nullable } from '@root/types/common/types';
import {
  GEOFENCE_FILL_COLOR,
  GEOFENCE_STROKE_COLOR,
  GEOFENCE_STROKE_COLOR_ACTIVATED,
  POLYLINE_COLOR,
  STATIONARY_REGION_FILL_COLOR,
  STATIONARY_REGION_STROKE_COLOR,
} from '@screens/mapScreen/colors';
import {
  initialStationaryRadius,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  undefinedLocation,
} from '@screens/mapScreen/initialStates';
import {
  CoordinatesType,
  GeofenceType,
  MapCenterType,
  MarkerType,
  StopZoneType,
  TriggeredGeofenceEventMarkerType,
  TriggeredGeofenceType,
} from '@screens/mapScreen/types';
import { View } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { LongPressEvent } from 'react-native-maps/lib/MapView.types';

import { styles } from './styles';

const { BLACK, MALACHITE2, CANDLELIGHT, RED } = COLORS;

export const MapScreen = () => {
  const [isBackgroundGeolocationEnabled, setIsBackgroundGeolocationEnabled] =
    useState<boolean>(false);
  const [mapScrollEnabled, setMapScrollEnabled] = useState<boolean>(false);
  const [isShowUserLocation, setIsShowUserLocation] = useState<boolean>(false);
  const [tracksViewChanges, setTracksViewChanges] = useState<boolean>(false);
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);
  const [stationaryLocation, setStationaryLocation] = useState(undefinedLocation); // location in stationary mode
  const [stopZones, setStopZones] = useState<StopZoneType[]>([]); // stop-zone markers - small red circles where the plugin previously entered the stationary mode
  const [geofences, setGeofences] = useState<GeofenceType[]>([]); // list of current active geofences that BackgroundGeolocation is monitoring
  const [triggeredGeofences, setTriggeredGeofences] = useState<TriggeredGeofenceType[]>(
    [],
  ); // list of triggered geofences
  const [triggeredGeofencesEventMarkers, setTriggeredGeofencesEventMarkers] = useState<
    TriggeredGeofenceEventMarkerType[]
  >([]); // markers showing where a geofence trigger events occurred
  const [geofenceEvent, setGeofenceEvent] = useState<Nullable<GeofenceEvent>>(null);
  const [coordinates, setCoordinates] = useState<CoordinatesType[]>([]); // coordinates of tracking points on map for drawing user route
  const [markers, setMarkers] = useState<MarkerType[]>([]); // small dots with title(title show on press) on the map where the user's position was marked
  const [location, setLocation] = useState<Nullable<Location>>(null); // current user location
  const [motionChangeEvent, setMotionChangeEvent] =
    useState<Nullable<MotionChangeEvent>>(null);
  const [lastMotionChangeEvent, setLastMotionChangeEvent] =
    useState<Nullable<MotionChangeEvent>>(null);
  const [geofencesChangeEvent, setGeofencesChangeEvent] =
    useState<Nullable<GeofencesChangeEvent>>(null);
  const [stationaryRadius, setStationaryRadius] = useState<number>(
    initialStationaryRadius,
  );
  const [mapCenter, setMapCenter] = useState<MapCenterType>({
    latitude: 45.518853,
    longitude: -73.60055,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  // Collection of BackgroundGeolocation event-subscriptions
  const subscriptions: Subscription[] = [];

  // Add a BackgroundGeolocation event subscription to collection
  const subscribe = (subscription: Subscription) => {
    subscriptions.push(subscription);
  };

  // Iterate BackgroundGeolocation subscriptions and .remove() each
  const unsubscribe = () => {
    subscriptions.forEach((subscription: Subscription) => subscription.remove());
    subscriptions.splice(0, subscriptions.length);
  };

  // EnabledChange effect-handler. Removes all MapView Markers when plugin is disabled
  const onEnabledChange = () => {
    console.log('Background geolocation is enable -', isBackgroundGeolocationEnabled);
    setIsShowUserLocation(isBackgroundGeolocationEnabled);

    if (!isBackgroundGeolocationEnabled) {
      clearMarkers();
    }
  };

  // Center the map
  const setCenter = (location: Location) => {
    setMapCenter({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  // Add a location Marker to map
  const addMarker = (location: Location) => {
    const timestamp = new Date();
    const marker: MarkerType = {
      key: `${location.uuid}:${timestamp.getTime()}`,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };

    setMarkers((previous) => [...previous, marker]);
    setCoordinates((previous) => [
      ...previous,
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    ]);
  };

  // onLocation effect-handler. Adds a location Marker to MapView
  const onLocation = () => {
    console.log('location -', location);

    if (location !== null && !location.sample) {
      addMarker(location);
    }

    if (location !== null) {
      setCenter(location);
    }
  };

  /*// Geofence press-handler
  const onPressGeofence = () => {
    console.log('[onGeofencePress] NO IMPLEMENTATION');
  };*/

  // Returns a geofence marker for MapView
  const createGeofenceMarker = (geofence: Geofence) => {
    return {
      radius: geofence.radius,
      center: {
        latitude: geofence.latitude,
        longitude: geofence.longitude,
      },
      identifier: geofence.identifier,
      strokeColor: GEOFENCE_STROKE_COLOR,
      fillColor: GEOFENCE_FILL_COLOR,
    };
  };

  // Map pan/drag handler
  const onMapPanDrag = () => {
    setFollowUserLocation(false);
    setMapScrollEnabled(true);
  };

  // Map long-press handler for adding a geofence
  const onLongPress = (longPressEvent: LongPressEvent) => {
    const coordinate = longPressEvent.nativeEvent.coordinate;

    console.log(
      `Long press. Coordinates: latitude: ${coordinate.latitude}, longitude: ${coordinate.longitude}`,
    );
    /*navigation.navigate('Geofence', { coordinate: coordinate });*/

    const geofence: Geofence = {
      identifier: Math.random().toString(),
      radius: 150,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: false,
      loiteringDelay: parseInt('10000', 10),
    };

    BackgroundGeolocation.addGeofence(geofence)
      .then(() => {
        console.log('Success adding geofence');
        /*navigation.goBack();*/
      })
      .catch((error) => {
        console.log('Error adding geofence:', error);
      });
  };

  const clearMarkers = () => {
    setCoordinates([]);
    setMarkers([]);
    setStopZones([]);
    setGeofences([]);
    setTriggeredGeofences([]);
    setTriggeredGeofencesEventMarkers([]);
    setStationaryRadius(0);
    setGeofenceEvent(null);
  };

  // onMotionChangeEvent effect-handler. Show/hide the red stationary-geofence according isMoving
  const onMotionChange = async () => {
    if (motionChangeEvent !== null && motionChangeEvent.isMoving) {
      if (lastMotionChangeEvent) {
        setStopZones((previous) => [
          ...previous,
          {
            coordinate: {
              latitude: lastMotionChangeEvent.location.coords.latitude,
              longitude: lastMotionChangeEvent.location.coords.longitude,
            },
            key: lastMotionChangeEvent.location.timestamp,
          },
        ]);
      }
      setStationaryRadius(0);
      setStationaryLocation(undefinedLocation);
    } else if (motionChangeEvent !== null && !motionChangeEvent.isMoving) {
      const state = await BackgroundGeolocation.getState();
      const geofenceProximityRadius = state.geofenceProximityRadius || 1000;

      setStationaryRadius(
        state.trackingMode === 1 ? initialStationaryRadius : geofenceProximityRadius / 2,
      );

      setStationaryLocation({
        timestamp: motionChangeEvent.location.timestamp,
        latitude: motionChangeEvent.location.coords.latitude,
        longitude: motionChangeEvent.location.coords.longitude,
      });
    }

    setLastMotionChangeEvent(motionChangeEvent);
  };

  // GeofenceEvent effect-handler. Renders geofence event markers to MapView
  const onGeofence = () => {
    const geofence = geofences.find((item) => {
      if (geofenceEvent !== null) {
        return item.identifier === geofenceEvent.identifier;
      }
    });

    if (!geofence) {
      return;
    }

    /*marker.fillColor = GEOFENCE_STROKE_COLOR_ACTIVATED;
    marker.strokeColor = GEOFENCE_STROKE_COLOR_ACTIVATED;*/

    const triggeredGeofence = triggeredGeofences.find((item) => {
      if (geofenceEvent !== null) {
        return item.identifier === geofenceEvent.identifier;
      }
    });

    if (!triggeredGeofence && geofenceEvent !== null) {
      console.log('newTriggeredGeofence');

      showNotification();

      const newTriggeredGeofence: TriggeredGeofenceType = {
        identifier: geofenceEvent.identifier,
        radius: geofence.radius,
        center: {
          latitude: geofence.center.latitude,
          longitude: geofence.center.longitude,
        },
        events: [],
      };

      setTriggeredGeofences((previous) => [...previous, newTriggeredGeofence]);
    }

    // Get bearing of location relative to geofence center
    if (geofenceEvent !== null) {
      const location: Location = geofenceEvent.location;
      const coords = location.coords;
      const bearing = getBearing(geofence.center, location.coords);
      const edgeCoordinate = computeOffsetCoordinate(
        geofence.center,
        geofence.radius,
        bearing,
      );

      const triggeredGeofenceEventMarker: TriggeredGeofenceEventMarkerType = {
        coordinates: {
          computedCoordinates: edgeCoordinate,
          coordinates: { latitude: coords.latitude, longitude: coords.longitude },
        },

        action: geofenceEvent.action,
        key: `${geofenceEvent.identifier}:${geofenceEvent.action}:${location.timestamp}`,
      };

      setTriggeredGeofencesEventMarkers((previous) => [
        ...previous,
        triggeredGeofenceEventMarker,
      ]);
    }
  };

  // GeofencesChangeEvent effect-handler. Renders/removes geofence markers to/from MapView
  const onGeofencesChange = () => {
    if (geofencesChangeEvent !== null) {
      const on = geofencesChangeEvent.on;
      const off = geofencesChangeEvent.off;

      // Filter out all "off" geofences
      const geofencesOn = geofences.filter((geofence) => {
        return off.indexOf(geofence.identifier) < 0;
      });

      // console.log('[geofencesChange] -', geofencesChangeEvent);

      // Add new "on" geofences
      on.forEach((geofence: Geofence) => {
        const marker = geofencesOn.find((item) => {
          return item.identifier === geofence.identifier;
        });

        if (marker) {
          return;
        }

        geofencesOn.push(createGeofenceMarker(geofence));
      });

      setGeofences(geofencesOn);
    }
  };

  // Render the list of geoFences which have fired
  const renderTriggeredGeofences = () => {
    return triggeredGeofences.map((item) => {
      return (
        <Circle
          center={item.center}
          fillColor={GEOFENCE_STROKE_COLOR_ACTIVATED}
          key={'hit:' + item.identifier}
          radius={item.radius + 1}
          strokeColor={BLACK}
          strokeWidth={1}
        />
      );
    });
  };

  // Render the series of markers showing where a geofence hit event occurred
  const renderTriggeredGeofencesEventMarkers = () => {
    return triggeredGeofencesEventMarkers.map((item) => {
      const computedCoordinates = item.coordinates.computedCoordinates;
      const coordinates = item.coordinates.coordinates;

      let color;

      switch (item.action) {
        case 'ENTER':
          color = MALACHITE2;
          break;
        case 'EXIT':
          color = RED;
          break;
        case 'DWELL':
          color = CANDLELIGHT;
          break;
        default:
          break;
      }

      const markerStyle = {
        backgroundColor: color,
      };

      if (!!coordinates && !!computedCoordinates) {
        return (
          <View key={item.key}>
            <Polyline
              coordinates={[computedCoordinates, coordinates]}
              geodesic
              key='polyline'
              lineCap='square'
              strokeColor={BLACK}
              strokeWidth={1}
              zIndex={1}
            />
            <Marker
              anchor={{ x: 0, y: 0.1 }}
              coordinate={computedCoordinates}
              key='edge_marker'
            >
              <View style={[styles.geofenceHitMarker, markerStyle]} />
            </Marker>
            <Marker
              anchor={{ x: 0, y: 0.1 }}
              coordinate={coordinates}
              key='location_marker'
            >
              <View style={styles.markerIcon} />
            </Marker>
          </View>
        );
      }
    });
  };

  // Render the list of current active geofences that BackgroundGeolocation is monitoring
  const renderActiveGeofences = () => {
    return geofences.map((geofence) => {
      return (
        <Circle
          center={geofence.center}
          fillColor={geofence.fillColor}
          key={geofence.identifier}
          /*onPress={onPressGeofence}*/
          radius={geofence.radius}
          strokeColor={geofence.strokeColor}
          strokeWidth={1}
        />
      );
    });
  };

  // Render stop-zone markers - small red circles where the plugin previously entered the stationary state
  const renderStopZoneMarkers = () => {
    return stopZones.map((stopZone) => (
      <Marker
        anchor={{ x: 0, y: 0 }}
        coordinate={stopZone.coordinate}
        key={stopZone.key}
        tracksViewChanges={tracksViewChanges}
      >
        <View style={styles.stopZoneMarker} />
      </Marker>
    ));
  };

  // MapView Location marker-renderer
  const renderMarkers = () => {
    const newMarkersArray: ReactElement[] = [];

    markers.map((marker) => {
      newMarkersArray.push(
        <Marker
          anchor={{ x: 0, y: 0.1 }}
          coordinate={marker.coordinate}
          key={marker.key}
          title={marker.title}
          tracksViewChanges={tracksViewChanges}
        >
          <View style={styles.markerIcon} />
        </Marker>,
      );
    });

    return newMarkersArray;
  };

  // Register BackgroundGeolocation event-listeners
  useEffect(() => {
    BackgroundGeolocation.getState().then((state: State) => {
      setIsBackgroundGeolocationEnabled(state.enabled);
    });

    // All BackgroundGeolocation event-listeners use useState setters
    subscribe(
      BackgroundGeolocation.onLocation(setLocation, (error) => {
        console.warn('[onLocation] ERROR: ', error);
      }),
    );
    subscribe(BackgroundGeolocation.onMotionChange(setMotionChangeEvent));
    subscribe(BackgroundGeolocation.onGeofence(setGeofenceEvent));
    subscribe(BackgroundGeolocation.onGeofencesChange(setGeofencesChangeEvent));
    subscribe(BackgroundGeolocation.onEnabledChange(setIsBackgroundGeolocationEnabled));

    return () => {
      // Important for with live-reload to remove BackgroundGeolocation event subscriptions
      unsubscribe();
      clearMarkers();
    };
  }, []);

  // onEnabledChange effect
  useEffect(() => {
    onEnabledChange();
  }, [isBackgroundGeolocationEnabled]);

  // onLocation effect
  useEffect(() => {
    if (!location) return;

    onLocation();
  }, [location]);

  // onMotionChange effect
  useEffect(() => {
    if (!motionChangeEvent) return;

    onMotionChange();
  }, [motionChangeEvent]);

  // onGeofence effect
  useEffect(() => {
    if (!geofenceEvent) return;

    onGeofence();
  }, [geofenceEvent]);

  // onGeofencesChange effect
  useEffect(() => {
    if (!geofencesChangeEvent) return;

    onGeofencesChange();
  }, [geofencesChangeEvent]);

  return (
    <View style={styles.mapScreenContainer}>
      <MapView
        followsUserLocation={false}
        onLongPress={onLongPress}
        onPanDrag={onMapPanDrag}
        provider={PROVIDER_GOOGLE}
        region={mapCenter}
        scrollEnabled={mapScrollEnabled}
        showsMyLocationButton
        showsPointsOfInterest
        showsScale={false}
        showsTraffic={false}
        showsUserLocation={isShowUserLocation}
        style={styles.mapView}
        toolbarEnabled={false}
      >
        <Circle
          center={{
            latitude: stationaryLocation.latitude,
            longitude: stationaryLocation.longitude,
          }}
          fillColor={STATIONARY_REGION_FILL_COLOR}
          key={'stationary-location:' + stationaryLocation.timestamp}
          radius={stationaryRadius}
          strokeColor={STATIONARY_REGION_STROKE_COLOR}
          strokeWidth={1}
        />
        <Polyline
          coordinates={coordinates}
          geodesic
          key='polyline'
          strokeColor={POLYLINE_COLOR}
          strokeWidth={6}
          zIndex={0}
        />
        {renderMarkers()}
        {renderStopZoneMarkers()}
        {renderActiveGeofences()}
        {renderTriggeredGeofences()}
        {renderTriggeredGeofencesEventMarkers()}
        {/*<Polyline
          coordinates={[
            { latitude: 37.78825, longitude: -122.4324 },
            { latitude: 37.7925, longitude: -122.4304 },
            { latitude: 37.791, longitude: -122.4351 },
          ]}
          geodesic
          key='polyline'
          strokeColor='rgba(0,179,253, 0.6)'
          strokeWidth={6}
          zIndex={0}
        />
        <Circle
          center={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          fillColor='#00EE0044'
          key='circle'
          radius={200}
          strokeColor='green'
          strokeWidth={3}
          zIndex={5}
        />
        <Marker
          coordinate={{ latitude: 37.7925, longitude: -122.4304 }}
          icon={require('../../assets/images/mapMarker.png')}
          image={require('../../assets/images/mapMarker.png')}
          isPreselected
          key='marker1'
          title='marker1'
        />
        <Marker
          coordinate={{ latitude: 37.791, longitude: -122.4351 }}
          icon={require('../../assets/images/mapMarker.png')}
          image={require('../../assets/images/mapMarker.png')}
          isPreselected
          key='marker2'
          title='marker2'
        />*/}
      </MapView>
    </View>
  );
};
