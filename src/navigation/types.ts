export enum RootStackScreens {
  WITH_AUTH = 'WithAuth',
  SIGN_IN = 'SignIn',
}

export type RootStackParamList = {
  [S in RootStackScreens]: undefined;
};
