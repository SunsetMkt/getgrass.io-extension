import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import grassApi from "../../../apis/grassApi";
import { QueryKeys } from "../../../constants/queryKeys";
import { ApiResponse } from "../../../models/api";
import { API_ROUTES } from "../../../constants/routes";
import { ActiveIp } from "../../../models/seller";

const getActiveIps = async () => {
  return await grassApi.get(API_ROUTES.ACTIVE_IPS);
};

export const useActiveIpsData = (
  options?: UseQueryOptions<AxiosResponse<ApiResponse<ActiveIp[]>>, AxiosError>
) => {
  return useQuery({
    queryKey: [QueryKeys.ACTIVE_IPS],
    queryFn: () => {
      return getActiveIps();
    },
    ...options,
  });
};
