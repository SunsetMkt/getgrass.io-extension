import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import grassApi from "../../../apis/grassApi";
import { API_ROUTES } from "../../../constants/routes";
import { ApiResponse } from "../../../models/api";

export interface PauseConnectionParams {
  pauseConnectionExpiry: string;
}

const pauseConnection = async (params: PauseConnectionParams) => {
  return await grassApi.post(API_ROUTES.PAUSE_CONNECTION, params);
};

export const usePauseConnection = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError,
    PauseConnectionParams
  >
) => {
  return useMutation({
    mutationFn: (params: PauseConnectionParams) => {
      return pauseConnection(params);
    },
    ...options,
  });
};
