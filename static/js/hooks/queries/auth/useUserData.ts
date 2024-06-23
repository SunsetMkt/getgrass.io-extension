import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { ApiErrorResponse, ApiResponse } from "../../../models/api";
import { User } from "../../../models/user";
import { API_ROUTES } from "../../../constants/routes";
import grassApi from "../../../apis/grassApi";
import { QueryKeys } from "../../../constants/queryKeys";

const getUserData = async () => {
  return await grassApi.get(API_ROUTES.USER);
};

export const useUserData = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<User>>,
    AxiosError<ApiErrorResponse>
  >
) => {
  return useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: () => {
      return getUserData();
    },
    ...options,
  });
};
