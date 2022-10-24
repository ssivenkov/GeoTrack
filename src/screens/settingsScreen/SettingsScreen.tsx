import React, { useState } from 'react';

import { Loader } from '@components/common/loader/Loader';
import { signOutAction } from '@store/actions/userSagaActions/signOutAction';
import { userAvatarSelector, userDataSelector } from '@store/selectors/userSelectors';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './styles';

export const SettingsScreen = () => {
  const dispatch = useDispatch();

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
          <TouchableOpacity disabled={waitingProcess} onPress={signOutHandler}>
            <Text>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return <Loader />;
};
