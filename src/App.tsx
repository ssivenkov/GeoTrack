import React from 'react';

import { Navigation } from '@navigation/Navigation';
import { StatusBar } from 'react-native';

export const App = () => {
  return (
    <>
      <StatusBar barStyle='light-content' />
      <Navigation />
    </>
  );
};
