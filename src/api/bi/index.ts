import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  BiResponse,
  Chart,
  ChartQueryRequest,
  genChartByAiUsingPOSTParams,
} from "./types";

/**
 * 上传文件
 *
 * @param file
 */
// export function uploadFileApi(file: File): AxiosPromise<FileInfo> {
//   const formData = new FormData();
//   formData.append('file', file);
//   return request({
//     url: '/api/v1/files',
//     method: 'post',
//     data: formData,
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// }

export async function genChartByAiUsingPOST(
  file: File,
  para: genChartByAiUsingPOSTParams
): AxiosPromise<BiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/bi/chart/gen",
    method: "post",
    params: para,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function genChartByAiAsyncUsingPOST(
  file: File,
  para: genChartByAiUsingPOSTParams
): AxiosPromise<BiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/bi/chart/gen/async",
    method: "post",
    params: para,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function listMyChartByPageUsingPOST(
  queryParams: ChartQueryRequest
): AxiosPromise<Chart[]> {
  return request({
    url: "/api/bi/chart/my/list/page",
    method: "post",
    data: queryParams,
  });
}
