import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { API_ROUTES } from "../../../constants/routes";
import { UserForgotPasswordParams } from "../../../models/user";
import grassApi from "../../../apis/grassApi";
import { ApiErrorResponse, ApiResponse } from "../../../models/api";

const forgotPassword = async (params: UserForgotPasswordParams) => {
  return await grassApi.post(API_ROUTES.FORGOT_PASSWORD, {
    email: params.email,
  });
};

export const useForgotPassword = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiErrorResponse>,
    UserForgotPasswordParams
  >
) => {
  return useMutation({
    mutationFn: (params: UserForgotPasswordParams) => {
      return forgotPassword(params);
    },
    ...options,
  });
};
