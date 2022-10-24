import { GOOGLE_PROVIDER_ID } from '@constants/constants';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { Nullable } from '@root/types/common/types';
import { SetAuthStateActionReturnType } from '@store/actions/userReducerActions/setAuthStateAction';
import { SetChannelIDActionReturnType } from '@store/actions/userReducerActions/setChannelIDAction';
import { SetGlobalLoaderActionReturnType } from '@store/actions/userReducerActions/setGlobalLoaderAction';
import { SetIsUserDataSynchronizedActionReturnType } from '@store/actions/userReducerActions/setIsUserDataSynchronizedAction';
import { SetProviderIDActionReturnType } from '@store/actions/userReducerActions/setProviderIDAction';
import { SetUserAvatarActionReturnType } from '@store/actions/userReducerActions/setUserAvatarAction';
import { SetUserDataActionReturnType } from '@store/actions/userReducerActions/setUserDataAction';

export type SnapshotType = FirebaseDatabaseTypes.DataSnapshot;
export type UserDataType = Nullable<FirebaseAuthTypes.User>;
export type UserIDType = Nullable<FirebaseAuthTypes.User['uid']>;
export type ChannelIDType = string;
export type ProviderIDType = Nullable<typeof GOOGLE_PROVIDER_ID>;
export type UserAvatarType = Nullable<string>;

export type UserReducerStateType = {
  providerID: ProviderIDType;
  userData: UserDataType;
  channelID: ChannelIDType;
  userAvatar: UserAvatarType;
  globalLoader: boolean;
  isUserDataSynchronized: boolean;
};

export type UserReducerActionsType =
  | SetAuthStateActionReturnType
  | SetUserDataActionReturnType
  | SetChannelIDActionReturnType
  | SetProviderIDActionReturnType
  | SetUserAvatarActionReturnType
  | SetGlobalLoaderActionReturnType
  | SetIsUserDataSynchronizedActionReturnType;
