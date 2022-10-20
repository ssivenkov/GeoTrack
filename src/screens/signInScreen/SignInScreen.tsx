import React from 'react';

import { COLORS } from '@colors/colors';
import { GOOGLE_TITLE } from '@constants/constants';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { SignInButton } from '@root/screens/signInScreen/signInButton/SignInButton';
import { signInStyles } from '@root/screens/signInScreen/signInButton/styles';
import { styles } from '@root/screens/signInScreen/styles';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { MALACHITE, NIAGARA, TORY_BLUE } = COLORS;

export const SignInScreen = () => {
  return (
    <LinearGradient colors={[MALACHITE, NIAGARA, TORY_BLUE]}>
      <View style={styles.signInWrapper}>
        <View style={styles.signInContainer}>
          <Text style={styles.screenTitle}>GeoTrack</Text>
          <SignInButton
            colorStyle={signInStyles.googleStyle}
            disabled={false}
            icon={faGoogle}
            serviceTitle={GOOGLE_TITLE}
          />
        </View>
      </View>
    </LinearGradient>
  );
};
