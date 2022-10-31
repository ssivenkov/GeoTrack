import React, { useState } from 'react';

import { Loader } from '@components/common/loader/Loader';
import BackgroundGeolocation from '@lib/react-native-background-geolocation/react-native-background-geolocation';
import { signOutAction } from '@store/actions/userSagaActions/signOutAction';
import { userAvatarSelector, userDataSelector } from '@store/selectors/userSelectors';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Subscription } from 'react-native-background-geolocation';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './styles';

export const SettingsScreen = () => {
  const dispatch = useDispatch();

  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');

  console.log('current location -', location);

  React.useEffect(() => {
    // 1. Subscribe to events
    const onLocation: Subscription = BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      // eslint-disable-next-line no-magic-numbers
      setLocation(JSON.stringify(location, null, 2));
    });

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange: Subscription = BackgroundGeolocation.onActivityChange(
      (event) => {
        console.log('[onMotionChange]', event);
      },
    );

    const onProviderChange: Subscription = BackgroundGeolocation.onProviderChange(
      (event) => {
        console.log('[onProviderChange]', event);
      },
    );

    // 2. Ready the plugin
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: 'http://yourserver.com/locations',
      batchSync: false, // [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        // Optional HTTP headers
        // 'X-FOO': 'bar',
      },
      params: {
        // Optional HTTP params
        // auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      },
    })
      .then((state) => {
        setEnabled(state.enabled);
        console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);
      })
      .catch((error) => {
        console.warn('- BackgroundGeolocation error: ', error);
      });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  // 3. Start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  const userData = useSelector(userDataSelector);
  const userAvatar = useSelector(userAvatarSelector);

  const [waitingProcess, setWaitingProcess] = useState<boolean>(false);

  const signOutHandler = (): void => {
    dispatch(signOutAction({ setWaitingProcess }));
  };

  if (userData && !waitingProcess) {
    return (
      <ScrollView>
        <View style={styles.screenContainer}>
          <View style={styles.userInfoContainer}>
            {userAvatar && <Image source={{ uri: userAvatar }} style={styles.avatar} />}
            {userData.displayName && (
              <Text style={styles.name}>{userData.displayName}</Text>
            )}
            {userData.email && <Text style={styles.text}>{userData.email}</Text>}
            {userData.phoneNumber && (
              <Text style={styles.text}>{userData.phoneNumber}</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={waitingProcess}
              onPress={() => setEnabled(!enabled)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                Background geolocation is
                {enabled ? ' enabled' : ' disabled'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={waitingProcess}
              onPress={signOutHandler}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return <Loader />;
};
