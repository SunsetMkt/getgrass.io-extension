import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useToast } from "@chakra-ui/react";
import { ClientJS } from "clientjs";
import { v5 as uuidv5 } from "uuid";
import { useNavigate } from "react-router-dom";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

import grassApi from "../apis/grassApi";
import useLocalStorage from "../hooks/useLocalStorage";
import { ROUTES } from "../constants/routes";
import {
  AUTHENTICATED_KEY,
  BROWSER_ID_KEY,
  KEYS,
  USER_ID_KEY,
} from "../constants/keys";
import { getIpAddress } from "../utils/ip";
import { getStorageValue } from "../utils/storage";
import { useUserData } from "../hooks/queries/auth/useUserData";
import { QueryKeys } from "../constants/queryKeys";
import {
  AuthChangeType,
  AuthStateProps,
  authReducer,
  initialAuthState,
} from "../reducers/authReducer";
import { useUserSettingsData } from "../hooks/queries/auth/useUserSettingsData";
import { useDeviceData } from "../hooks/queries/seller/useDeviceData";

dayjs.extend(utc);

interface AuthContextProps extends AuthStateProps {
  isAuthenticated?: boolean;
  previousScore: number;
  userId?: string;
  refreshToken: string;
  accessToken: string;
  userDataIsLoading: boolean;
  userSettingsDataIsLoading: boolean;
  deviceDataIsLoading: boolean;
  username: string;
  logoutUser: () => Promise<void>;
  reconnect: () => void;
  updateUserSettings: (userSettings: {
    pauseConnectionExpiry: string;
    isConnectionPaused: boolean;
  }) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  ...initialAuthState,
  previousScore: 0,
  userId: "",
  refreshToken: "",
  accessToken: "",
  userDataIsLoading: false,
  userSettingsDataIsLoading: false,
  deviceDataIsLoading: false,
  username: "",
  logoutUser: async () => {},
  reconnect: () => {},
  updateUserSettings: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [accessToken, setAccessToken] = useLocalStorage<string>(
    KEYS.ACCESS_TOKEN,
    ""
  );
  const [refreshToken, setRefreshToken] = useLocalStorage<string>(
    KEYS.REFRESH_TOKEN,
    ""
  );
  const [username, setUsername] = useLocalStorage<string>(KEYS.USERNAME, "");

  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<
    boolean | undefined
  >(AUTHENTICATED_KEY, undefined);
  const [browserId, setBrowserId] = useLocalStorage<string>(BROWSER_ID_KEY, "");
  const [userId, setUserId] = useLocalStorage<string>(USER_ID_KEY, "");
  const [previousScore, setPreviousScore] = useLocalStorage<number>(
    "previousScore",
    0
  );
  const [ipAddress, setIpAddress] = useState("");

  const {
    data: userData,
    refetch: refetchUserData,
    isSuccess: userDataIsSuccess,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
    error: userDataError,
  } = useUserData({
    enabled: false,
    queryKey: [QueryKeys.USER],
  });

  useEffect(() => {
    if (accessToken) {
      configureApiAuthorization(accessToken);
      refetchUserData();
    }
  }, [accessToken]);

  useEffect(() => {
    if (userDataIsSuccess && userData) {
      const user = userData.data.result.data;

      dispatch({
        type: AuthChangeType.AUTHENTICATE_USER,
        payload: user,
      });

      setUserId(user.userId);
      setIsAuthenticated(true);
      setUsername(user.username);
    }
  }, [userDataIsSuccess, userData]);

  useEffect(() => {
    if (
      userDataError &&
      userDataIsError &&
      userDataError.response?.status === 401
    ) {
      console.error(`[USER] ${userDataError}`);
      logoutUser();
    }
  }, [userDataError, userDataIsError]);

  const {
    data: userSettingsData,
    isSuccess: userSettingsDataIsSuccess,
    isLoading: userSettingsDataIsLoading,
  } = useUserSettingsData({
    enabled: isAuthenticated && !!state.user,
    queryKey: [QueryKeys.USER_SETTINGS, state.user?.userId],
  });

  useEffect(() => {
    if (userSettingsDataIsSuccess && userSettingsData) {
      const userSettings = userSettingsData.data.result.data;
      let isConnectionPaused = false;

      if (!!userSettings.pauseConnectionExpiry) {
        const expiry = dayjs.utc(userSettings.pauseConnectionExpiry);
        isConnectionPaused = dayjs.utc().isBefore(expiry);
      }

      dispatch({
        type: AuthChangeType.LOAD_USER_SETTINGS,
        payload: {
          ...userSettings,
          isConnectionPaused,
        },
      });
    }
  }, [userSettingsDataIsSuccess, userSettingsData]);

  const {
    data: deviceData,
    isSuccess: deviceDataIsSuccess,
    isLoading: deviceDataIsLoading,
    refetch: refetchDeviceData,
  } = useDeviceData(
    { deviceId: browserId },
    {
      enabled: !!isAuthenticated && !!state.user && !!browserId,
      queryKey: [
        QueryKeys.DEVICE,
        `${browserId}:${ipAddress}:${state.user?.userId}`,
      ],
    }
  );

  useEffect(() => {
    if (deviceDataIsSuccess && deviceData) {
      const device = deviceData.data.result.data;

      dispatch({
        type: AuthChangeType.LOAD_DEVICE,
        payload: device,
      });

      if (device.ipScore !== previousScore) {
        setPreviousScore(device.ipScore);
      }
    }
  }, [deviceDataIsSuccess, deviceData]);

  useEffect(() => {
    // Run this to declare a unique browser id
    const loadBrowserId = async () => {
      const browserIdStorage = await getStorageValue(BROWSER_ID_KEY);

      if (!browserIdStorage) {
        const client = new ClientJS();
        const fingerprint = client.getFingerprint();
        const uuid = uuidv5(
          fingerprint.toString(),
          process.env.REACT_APP_NAMESPACE as string
        );
        setBrowserId(uuid);

        if (
          typeof chrome.runtime !== "undefined" &&
          process.env.NODE_ENV === "production"
        ) {
          chrome.runtime.sendMessage("reconnect", (response) => {
            console.log(response);
          });
        }
      }
    };

    loadBrowserId().catch(console.error);
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    const intervalFunction = setInterval(() => {
      if (isAuthenticated) {
        loadIpAddress();
      }
    }, 10000);

    return () => {
      clearInterval(intervalFunction);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const loadData = async () => {
      const userIdStorage = await getStorageValue(USER_ID_KEY);
      const isAuthenticatedStorage = await getStorageValue(AUTHENTICATED_KEY);

      if (typeof userIdStorage !== "string") {
        setIsAuthenticated(false);
      } else {
        if (isAuthenticatedStorage && !state.user) {
          // TODO: figure out what to replace
        } else if (isAuthenticatedStorage && state.user && userId) {
          setIsAuthenticated(true);
          navigate(ROUTES.DASHBOARD);
        } else if (!isAuthenticatedStorage && !state.user) {
          navigate(ROUTES.LOGIN);
        }
      }
    };

    loadData().catch(console.error);
  }, [userId, state.user, isAuthenticated]);

  const loadIpAddress = async () => {
    const loadedIpAddress = await getIpAddress();
    setIpAddress((prevState) => {
      if (Boolean(prevState) && prevState !== loadedIpAddress) {
        toast({
          title: "Network changed",
          description: "Extension will reconnect",
          status: "info",
          variant: "info",
          position: "top-left",
          isClosable: true,
        });

        if (
          typeof chrome.runtime !== "undefined" &&
          process.env.NODE_ENV === "production"
        ) {
          chrome.runtime.sendMessage("reconnect", (response) => {
            console.log(response);
          });
        }

        if (!!prevState && !!browserId) {
          refetchDeviceData();
        }
      }

      return loadedIpAddress;
    });
  };

  const logoutUser = async () => {
    setIsAuthenticated(false);
    setUserId("");
    setAccessToken("");
    setRefreshToken("");
    setUsername("");
    navigate(ROUTES.LOGIN);
  };

  const reconnect = async () => {
    if (
      typeof chrome.runtime !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      chrome.runtime.sendMessage("reconnect", (response) => {
        console.log(response);
      });
    } else {
      console.error("Cannot perform reconnection");
    }
  };

  const configureApiAuthorization = async (accessToken: string) => {
    if (accessToken) {
      grassApi.defaults.headers.common["Authorization"] = `${accessToken}`;
    }
  };

  const updateUserSettings = (userSettings: {
    pauseConnectionExpiry?: string;
    isConnectionPaused: boolean;
  }) => {
    dispatch({
      type: AuthChangeType.UPDATE_USER_SETTINGS,
      payload: {
        ...state.userSettings,
        ...userSettings,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated,
        previousScore,
        userId,
        accessToken,
        refreshToken,
        userDataIsLoading,
        userSettingsDataIsLoading,
        deviceDataIsLoading,
        username,
        logoutUser,
        reconnect,
        updateUserSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
