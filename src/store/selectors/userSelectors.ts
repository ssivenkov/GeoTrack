import { UserIDType, UserReducerStateType } from '@store/reducers/userReducer/types';
import { AppRootStateType } from '@store/types';

export const userIDSelector = (state: AppRootStateType): UserIDType => {
  return state.user.userData?.uid ?? null;
};

export const userDataSelector = (
  state: AppRootStateType,
): UserReducerStateType['userData'] => {
  return state.user.userData;
};

export const userAvatarSelector = (
  state: AppRootStateType,
): UserReducerStateType['userAvatar'] => {
  return state.user.userAvatar;
};

export const globalLoaderSelector = (
  state: AppRootStateType,
): UserReducerStateType['globalLoader'] => {
  return state.user.globalLoader;
};

export const isUserDataSynchronizedSelector = (
  state: AppRootStateType,
): UserReducerStateType['isUserDataSynchronized'] => {
  return state.user.isUserDataSynchronized;
};
