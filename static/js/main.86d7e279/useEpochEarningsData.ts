import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { ApiPaginationParams, PaginatedApiResponse } from "../../../models/api";
import grassApi from "../../../apis/grassApi";
import { API_ROUTES } from "../../../constants/routes";
import { QueryKeys } from "../../../constants/queryKeys";
import { EpochEarning } from "../../../models/seller";

const getEpochEarningsData = async (pagination?: ApiPaginationParams) => {
  const params = { ...pagination };

  return await grassApi.get(API_ROUTES.EPOCH_EARNINGS, {
    params: {
      input: JSON.stringify(params),
    },
  });
};

export const useEpochEarningsData = (
  pagination?: ApiPaginationParams,
  options?: UseQueryOptions<
    AxiosResponse<PaginatedApiResponse<EpochEarning[]>>,
    AxiosError
  >
) => {
  return useQuery({
    queryKey: [
      QueryKeys.EPOCH_EARNINGS,
      `${pagination?.limit}:${pagination?.lastEvaluationKey}`,
    ],
    queryFn: () => {
      return getEpochEarningsData(pagination);
    },
    ...options,
  });
};
