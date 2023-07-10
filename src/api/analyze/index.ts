import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AnalyzeForm, AnalyzePageVO, AnalyzeQuery } from "./types";

export function getAnalyzePage(
  queryParams: AnalyzeQuery
): AxiosPromise<PageResult<AnalyzePageVO[]>> {
  return request({
    url: "/distribute/station/stationAnalyze",
    method: "post",
    data: queryParams,
  });
}
