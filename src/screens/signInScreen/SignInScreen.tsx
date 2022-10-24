import React, { useState } from 'react';

import { COLORS } from '@colors/colors';
import { Loader } from '@components/common/loader/Loader';
import { GOOGLE_TITLE } from '@constants/constants';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { SignInButton } from '@root/screens/signInScreen/signInButton/SignInButton';
import { signInStyles } from '@root/screens/signInScreen/signInButton/styles';
import { styles } from '@root/screens/signInScreen/styles';
import { googleSignInAction } from '@store/actions/userSagaActions/GoogleSignInAction';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';

const { MALACHITE, NIAGARA, TORY_BLUE } = COLORS;

export const SignInScreen = () => {
  const dispatch = useDispatch();

  const [waitingUserData, setWaitingUserData] = useState<boolean>(false);

  const onGoogleButtonPress = (): void => {
    dispatch(googleSignInAction({ setWaitingUserData }));
  };

  return (
    <LinearGradient colors={[MALACHITE, NIAGARA, TORY_BLUE]}>
      {waitingUserData ? (
        <Loader />
      ) : (
        <View style={styles.signInWrapper}>
          <View style={styles.signInContainer}>
            <Text style={styles.screenTitle}>GeoTrack</Text>
            <SignInButton
              colorStyle={signInStyles.googleStyle}
              disabled={false}
              icon={faGoogle}
              onPress={onGoogleButtonPress}
              serviceTitle={GOOGLE_TITLE}
            />
          </View>
        </View>
      )}
    </LinearGradient>
  );
};
