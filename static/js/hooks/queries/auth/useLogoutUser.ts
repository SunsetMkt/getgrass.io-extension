import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { API_ROUTES } from "../../../constants/routes";
import grassApi from "../../../apis/grassApi";

const logoutUser = async (refreshToken: string) => {
  return await grassApi.post(API_ROUTES.REVOKE_TOKEN, {
    refreshToken,
  });
};

export const useLogoutUser = (
  options?: UseMutationOptions<AxiosResponse, AxiosError, string>
) => {
  return useMutation({
    mutationFn: (refreshToken: string) => {
      return logoutUser(refreshToken);
    },
    ...options,
  });
};
