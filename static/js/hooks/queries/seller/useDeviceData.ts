import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import grassApi from "../../../apis/grassApi";
import { API_ROUTES } from "../../../constants/routes";
import { ApiErrorResponse, ApiResponse } from "../../../models/api";
import { Device } from "../../../models/seller";
import { QueryKeys } from "../../../constants/queryKeys";

export interface GetDeviceParams {
  deviceId: string;
}

const getDeviceData = async (params: GetDeviceParams) => {
  return await grassApi.get(API_ROUTES.DEVICE, {
    params: {
      input: JSON.stringify(params),
    },
  });
};

export const useDeviceData = (
  params: GetDeviceParams,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Device>>,
    AxiosError<ApiErrorResponse>
  >
) => {
  return useQuery({
    queryKey: [QueryKeys.DEVICE, params.deviceId],
    queryFn: () => {
      return getDeviceData(params);
    },
    ...options,
  });
};
