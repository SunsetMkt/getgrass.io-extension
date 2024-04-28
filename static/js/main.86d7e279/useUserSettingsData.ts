import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import grassApi from "../../../apis/grassApi";
import { API_ROUTES } from "../../../constants/routes";
import { QueryKeys } from "../../../constants/queryKeys";
import { ApiResponse } from "../../../models/api";
import { UserSettings } from "../../../models/user";

const getUserSettingsData = async () => {
  return await grassApi.get(API_ROUTES.USER_SETTINGS);
};

export const useUserSettingsData = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UserSettings>>,
    AxiosError
  >
) => {
  return useQuery({
    queryKey: [QueryKeys.USER_SETTINGS],
    queryFn: () => {
      return getUserSettingsData();
    },
    ...options,
  });
};
