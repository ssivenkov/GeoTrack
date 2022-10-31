import React from 'react';

import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Polyline, Marker } from 'react-native-maps';

import { styles } from './styles';

export const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation
        style={styles.map}
      >
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
        <Polyline
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
        />
      </MapView>
    </View>
  );
};
