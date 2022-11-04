import notifee from '@notifee/react-native';

export const showNotification = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'Arrival in geofence',
    name: 'Notification channel when user arriving in his geofence',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Success',
    body: 'You have been arrived in your geofence',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional. Defaults to 'ic_launcher'
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'Arrival in geofence',
      },
    },
  });
};
