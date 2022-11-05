import React, { useEffect, useState } from 'react';

import { Loader } from '@components/common/loader/Loader';
import BackgroundGeolocation, {
  Subscription,
  Config,
  Location,
  MotionActivityEvent,
  State,
} from '@lib/react-native-background-geolocation/react-native-background-geolocation';
import { Nullable } from '@root/types/common/types';
import { backgroundGeolocationReadyConfig } from '@screens/settingsScreen/config';
import { signOutAction } from '@store/actions/userSagaActions/signOutAction';
import { userAvatarSelector, userDataSelector } from '@store/selectors/userSelectors';
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  AppState,
  Alert,
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './styles';

export const SettingsScreen = () => {
  const buttonStyle = (disable: boolean) => {
    return [styles.button, disable && styles.buttonDisabled];
  };

  const dispatch = useDispatch();

  const userData = useSelector(userDataSelector);
  const userAvatar = useSelector(userAvatarSelector);

  const [waitingProcess, setWaitingProcess] = useState<boolean>(false);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState<boolean>(false);
  const [isMovingEnabled, setIsMovingEnabled] = useState<boolean>(false);
  const [motionActivityEvent, setMotionActivityEvent] =
    useState<Nullable<MotionActivityEvent>>(null);
  const [odometer, setOdometer] = useState<number>(0);
  const [location, setLocation] = useState<Nullable<Location>>(null);

  // Init BackgroundGeolocation when view renders
  useEffect(() => {
    // 1. Register BackgroundGeolocation event-listeners

    // For printing odometer
    const locationSubscriber: Subscription = BackgroundGeolocation.onLocation(
      setLocation,
      (error) => {
        console.warn('[locationSubscriber] ERROR: ', error);
      },
    );

    // For auto-toggle geofence tracking button on motion change events
    const motionChangeSubscriber: Subscription = BackgroundGeolocation.onMotionChange(
      (location) => {
        setIsMovingEnabled(location.isMoving);
      },
    );

    // For printing the motion activity status
    const activityChangeSubscriber: Subscription =
      BackgroundGeolocation.onActivityChange(setMotionActivityEvent);

    // Configure BackgroundFetch (optional)
    initBackgroundFetch();

    // Configure BackgroundGeolocation.ready()
    initBackgroundGeolocation();

    AppState.addEventListener('change', appStateChangeHandler);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      activityChangeSubscriber.remove();
    };
  }, []);

  // Location effect-handler
  useEffect(() => {
    if (!location) {
      return;
    }

    setOdometer(location.odometer);
  }, [location]);

  const appStateChangeHandler = async (appStatusMode: string) => {
    console.log(`App working in ${appStatusMode} mode`);
  };

  // 2. Configure BackgroundGeolocation.ready
  const initBackgroundGeolocation = async () => {
    // Ready the SDK and fetch the current state

    const state: State = await BackgroundGeolocation.ready(
      backgroundGeolocationReadyConfig,
    );

    setOdometer(state.odometer);
    setIsGeolocationEnabled(state.enabled);
    setIsMovingEnabled(state.isMoving || false); // <-- TODO re-define @prop isMoving? as REQUIRED in State
  };

  const initBackgroundFetch = async () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        enableHeadless: true,
        stopOnTerminate: false,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] -', taskId);
        BackgroundFetch.finish(taskId);
      },
      (taskId) => {
        console.log('[BackgroundFetch] TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  };

  // <Switch> handler to toggle the plugin
  const onBackgroundGeolocationClick = async (value: boolean) => {
    const state = await BackgroundGeolocation.getState();

    setIsGeolocationEnabled(value);

    // 3. Start BackgroundGeolocation plugin
    if (value) {
      if (state.trackingMode === 1) {
        BackgroundGeolocation.start();
      } else {
        BackgroundGeolocation.startGeofences();
      }
    } else {
      BackgroundGeolocation.stop();
      setIsMovingEnabled(false);
    }
  };

  // Manually toggles motion state in SDK
  const onGeolocationTrackingClick = () => {
    BackgroundGeolocation.changePace(!isMovingEnabled);
    setIsMovingEnabled(!isMovingEnabled);
  };

  const resetOdometer = async () => {
    BackgroundGeolocation.setOdometer(0)
      .then((location) => {
        setOdometer(location.odometer);
        console.log('Reset odometer success');
      })
      .catch((error) => {
        console.log('Reset odometer failure: ' + error);
      });
  };

  const showAlertRequestPermission = async () => {
    const providerState = await BackgroundGeolocation.getProviderState();

    Alert.alert(
      'Request Location Permission',
      `Current authorization status: ${providerState.status}`,
      [
        {
          text: 'When in Use',
          onPress: () => {
            requestPermission('WhenInUse');
          },
        },
        {
          text: 'Always',
          onPress: () => {
            requestPermission('Always');
          },
        },
      ],
      { cancelable: false },
    );
  };

  const requestPermission = async (request: Config['locationAuthorizationRequest']) => {
    await BackgroundGeolocation.setConfig({ locationAuthorizationRequest: request });
    const status = await BackgroundGeolocation.requestPermission();

    console.log(`[requestPermission] status: ${status}`);

    setTimeout(() => {
      Alert.alert(
        'Request Permission Result',
        `Authorization status: ${status}`,
        [
          {
            text: 'Ok',
            // onPress: () => {},
          },
        ],
        { cancelable: false },
      );
    }, 10);
  };

  const signOutHandler = (): void => {
    dispatch(signOutAction({ setWaitingProcess }));
  };

  const geolocationTrackingCondition = waitingProcess || !isGeolocationEnabled;
  const backgroundGeolocationCondition = waitingProcess;

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
            <View style={styles.switchContainer}>
              <Text style={styles.text}>
                Background geolocation is
                {isGeolocationEnabled ? ' enabled' : ' disabled'}
              </Text>
              <Switch
                disabled={backgroundGeolocationCondition}
                onValueChange={onBackgroundGeolocationClick}
                style={
                  backgroundGeolocationCondition
                    ? styles.disabledSwitch
                    : styles.enabledSwitch
                }
                thumbColor={isGeolocationEnabled ? '#61c720' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#2d7213' }}
                value={isGeolocationEnabled}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.text}>
                Geolocation tracking is
                {isMovingEnabled ? ' enabled' : ' disabled'}
              </Text>
              <Switch
                disabled={geolocationTrackingCondition}
                onValueChange={onGeolocationTrackingClick}
                style={
                  geolocationTrackingCondition
                    ? styles.disabledSwitch
                    : styles.enabledSwitch
                }
                thumbColor={isMovingEnabled ? '#61c720' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#2d7213' }}
                value={isMovingEnabled}
              />
            </View>
          </View>
          <Text style={styles.text}>
            {'Motion activity status: '}
            {motionActivityEvent !== null ? motionActivityEvent.activity : 'unknown'}
          </Text>
          <Text style={styles.text}>
            {(odometer / 1000).toFixed(1)}
            km on odometer
          </Text>
          <TouchableOpacity onPress={resetOdometer} style={styles.button}>
            <Text style={styles.buttonText}>Reset odometer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showAlertRequestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Request permission</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={waitingProcess}
              onPress={signOutHandler}
              style={buttonStyle(waitingProcess)}
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
