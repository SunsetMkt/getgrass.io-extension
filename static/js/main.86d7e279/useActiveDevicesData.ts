import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import grassApi from "../../../apis/grassApi";
import { API_ROUTES } from "../../../constants/routes";
import { ApiResponse } from "../../../models/api";
import { ActiveDevice } from "../../../models/seller";
import { QueryKeys } from "../../../constants/queryKeys";

const getActiveDevices = async () => {
  return await grassApi.get(API_ROUTES.ACTIVE_DEVICES);
};

export const useActiveDevicesData = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<ActiveDevice[]>>,
    AxiosError
  >
) => {
  return useQuery({
    queryKey: [QueryKeys.ACTIVE_DEVICES],
    queryFn: () => {
      return getActiveDevices();
    },
    ...options,
  });
};
