import { UserReducerStateType } from '@store/reducers/userReducer/types';
import { rootReducer } from '@store/store';

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type RootStateType = {
  user: UserReducerStateType;
};
