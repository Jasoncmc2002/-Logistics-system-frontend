import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  StationForm,
  StationPageVO,
  StationQuery,
  SecondaryCategoryForm,
  SecondaryCategoryPageVO,
  SecondaryCategoryQuery,
  CentralStationForm,
  CentralStationQuery,
  CentralStationPageVO,
} from "./types";

/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getFirstCategoryForm(id: number): AxiosPromise<StationForm> {
  return request({
    url: "/distribute/firstcategory/" + id,
    method: "post",
  });
}

/**
 * 获取一级类别分页列表
 *
 * @param queryParams
 */
export function getFirstCategoryPage(
  queryParams: StationQuery
): AxiosPromise<PageResult<StationPageVO[]>> {
  return request({
    url: "/distribute/firstcategory/getList",
    method: "post",
    data: queryParams,
  });
}

export function deleteFirstCategoryForm(id: number) {
  return request({
    url: "/distribute/firstcategory/delete/" + id,
    method: "post",
  });
}

export function insertFirstCategoryForm(params: StationForm) {
  return request({
    url: "/distribute/firstcategory/create",
    method: "post",
    data: params,
  });
}
export function updateFirstCategoryForm(params: StationForm) {
  return request({
    url: "/distribute/firstcategory/update",
    method: "post",
    data: params,
  });
}
export function getSecondaryCategoryForm(
  id: number
): AxiosPromise<SecondaryCategoryForm> {
  return request({
    url: "/distribute/secondarycategory/" + id,
    method: "post",
  });
}

/**
 * 获取一级类别分页列表
 *
 * @param queryParams
 */
export function getSecondaryCategoryPage(
  queryParams: SecondaryCategoryQuery
): AxiosPromise<PageResult<SecondaryCategoryPageVO[]>> {
  return request({
    url: "/distribute/secondarycategory/getList",
    method: "post",
    data: queryParams,
  });
}

export function deleteSecondaryCategoryForm(id: number) {
  return request({
    url: "/distribute/secondarycategory/delete/" + id,
    method: "post",
  });
}

export function insertSecondaryCategoryForm(params: SecondaryCategoryForm) {
  return request({
    url: "/distribute/secondarycategory/create",
    method: "post",
    data: params,
  });
}
export function updateSecondaryCategoryForm(params: SecondaryCategoryForm) {
  return request({
    url: "/distribute/secondarycategory/update",
    method: "post",
    data: params,
  });
}

export function getCentralStationForm(
  id: number
): AxiosPromise<CentralStationForm> {
  return request({
    url: "/distribute/central-station/" + id,
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

export function getCentralStationPage(
  queryParams: CentralStationQuery
): AxiosPromise<PageResult<CentralStationPageVO[]>> {
  return request({
    url: "/distribute/central-station/getListByCondition",
    method: "post",
    data: queryParams,
  });
}

export function deleteCentralStationForm(id: number) {
  return request({
    url: "/distribute/central-station/delete/" + id,
    method: "post",
  });
}

export function insertCentralStationForm(params: CentralStationForm) {
  return request({
    url: "/distribute/central-station/create",
    method: "post",
    data: params,
  });
}
export function updateCentralStationForm(params: CentralStationForm) {
  return request({
    url: "/distribute/central-station/update",
    method: "post",
    data: params,
  });
}
export function updateCentralStationFormList(params: {
  warn: any;
  max: any;
  idList: any;
}) {
  return request({
    url: "/distribute/central-station/updateList",
    method: "post",
    data: params,
  });
}
