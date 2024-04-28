import { ReducerDispatchProps } from "../models/app";
import { Device } from "../models/seller";
import { User, UserSettings } from "../models/user";

export enum AuthChangeType {
  AUTHENTICATE_USER = "AUTHENTICATE_USER",
  UNAUTHENTICATE_USER = "UNAUTHENTICATE_USER",
  LOAD_USER_SETTINGS = "LOAD_USER_SETTINGS",
  UPDATE_USER_SETTINGS = "UPDATE_USER_SETTINGS",
  LOAD_DEVICE = "LOAD_DEVICE",
}

export interface AuthStateProps {
  user: User | null;
  userSettings: UserSettings | null;
  device: Device | null;
}

export const initialAuthState: AuthStateProps = {
  user: null,
  userSettings: null,
  device: null,
};

export const authReducer = (
  state: AuthStateProps,
  { type, payload }: ReducerDispatchProps<AuthChangeType>
) => {
  switch (type) {
    case AuthChangeType.AUTHENTICATE_USER:
      return {
        ...state,
        user: payload,
      };
    case AuthChangeType.UPDATE_USER_SETTINGS:
    case AuthChangeType.LOAD_USER_SETTINGS:
      return {
        ...state,
        userSettings: payload,
      };
    case AuthChangeType.LOAD_DEVICE:
      return {
        ...state,
        device: payload,
      };
    case AuthChangeType.UNAUTHENTICATE_USER:
      return initialAuthState;
    default:
      return state;
  }
};
