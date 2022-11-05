import { USER_REDUCER_ACTION } from '@enums/userReducerEnum';
import {
  UserReducerActionsType,
  UserReducerStateType,
} from '@store/reducers/userReducer/types';

const userReducerState: UserReducerStateType = {
  providerID: null,
  userData: null,
  channelID: '',
  userAvatar: null,
  globalLoader: false,
  isUserDataSynchronized: false,
};

export const userReducer = (
  state: UserReducerStateType = userReducerState,
  action: UserReducerActionsType,
): UserReducerStateType => {
  switch (action.type) {
    case USER_REDUCER_ACTION.SET_CHANNEL_ID:
      return { ...state, channelID: action.payload.channelID };
    case USER_REDUCER_ACTION.SET_USER_DATA:
      return { ...state, userData: action.payload.userData };
    case USER_REDUCER_ACTION.SET_AUTH_STATE:
      return {
        ...state,
        userData: action.payload.userData,
        providerID: action.payload.providerID,
        isUserDataSynchronized: action.payload.isUserDataSynchronized,
      };
    case USER_REDUCER_ACTION.SET_PROVIDER_ID:
      return { ...state, providerID: action.payload.providerID };
    case USER_REDUCER_ACTION.SET_USER_AVATAR:
      return { ...state, userAvatar: action.payload.userAvatar };
    case USER_REDUCER_ACTION.SET_GLOBAL_LOADER:
      return { ...state, globalLoader: action.payload.globalLoader };
    case USER_REDUCER_ACTION.SET_IS_USER_DATA_SYNCHRONIZED:
      return { ...state, isUserDataSynchronized: action.payload.isUserDataSynchronized };
    default:
      return state;
  }
};
