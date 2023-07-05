import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  StationForm,
  StationQuery,
  StationPageVO,
  StationInOutForm,
  StationInOutQuery,
  StationInOutPageVO,
} from "./types";

export function getStationForm(id: number): AxiosPromise<StationForm> {
  return request({
    url: "/distribute/station/" + id,
    method: "post",
  });
}

// export function getCentralStationPage(
//   queryParams: CentralStationQuery
// ): AxiosPromise<PageResult<CentralStationPageVO[]>> {
//   return request({
//     url: "/distribute/central-station/getList",
//     method: "post",
//     data: queryParams,
//   });
// }

export function getStationPage(
  queryParams: StationQuery
): AxiosPromise<PageResult<StationPageVO[]>> {
  return request({
    url: "/distribute/station/getList",
    method: "post",
    data: queryParams,
  });
}

export function deleteStationForm(id: number) {
  return request({
    url: "/distribute/station/delete/" + id,
    method: "post",
  });
}

export function insertStationForm(params: StationForm) {
  return request({
    url: "/distribute/station/create",
    method: "post",
    data: params,
  });
}
export function updateStationForm(params: StationForm) {
  return request({
    url: "/distribute/station/update",
    method: "post",
    data: params,
  });
}

export function getStationInOutForm(
  id: number
): AxiosPromise<StationInOutForm> {
  return request({
    url: "/distribute/stationInOut/" + id,
    method: "post",
  });
}

export function getStationInOutPage(
  queryParams: StationInOutQuery
): AxiosPromise<PageResult<StationInOutPageVO[]>> {
  return request({
    url: "/distribute/stationInOut/getList",
    method: "post",
    data: queryParams,
  });
}

export function deleteStationInOutForm(id: number) {
  return request({
    url: "/distribute/stationInOut/delete/" + id,
    method: "post",
  });
}

export function insertStationInOutForm(params: StationInOutForm) {
  return request({
    url: "/distribute/stationInOut/create",
    method: "post",
    data: params,
  });
}
export function updateStationInOutForm(params: StationInOutForm) {
  return request({
    url: "/distribute/stationInOut/update",
    method: "post",
    data: params,
  });
}
