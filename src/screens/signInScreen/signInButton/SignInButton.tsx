import React from 'react';

import { ICON_SIZE_MEDIUM } from '@constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, TouchableOpacity } from 'react-native';

import { signInStyles } from './styles';
import { SignInButtonPropsType } from './types';

export const SignInButton = (props: SignInButtonPropsType) => {
  const { colorStyle, serviceTitle, icon, onPress, disabled } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[signInStyles.button, disabled ? signInStyles.disabled : colorStyle]}
    >
      <FontAwesomeIcon icon={icon} size={ICON_SIZE_MEDIUM} style={signInStyles.icon} />
      <Text style={signInStyles.text}>{`Sign in with ${serviceTitle}`}</Text>
    </TouchableOpacity>
  );
};
