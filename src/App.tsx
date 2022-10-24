import React from 'react';

import { Navigation } from '@navigation/Navigation';
import { persistor, store } from '@store/store';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle='light-content' />
        <Navigation />
      </PersistGate>
    </Provider>
  );
};
