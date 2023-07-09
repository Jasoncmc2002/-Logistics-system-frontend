import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  GoodPageVO,
  GoodQuery,
  GoodForm,
  OrderForm,
  OrderPageVO,
  OrderQuery,
  GoodQuery1,
  CreatOrder,
} from "./types";
import { CentralStationQuery } from "@/api/good/types";
/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getOrderForm(userId: number): AxiosPromise<OrderForm> {
  return request({
    url: "/api/v1/users/" + userId + "/form",
    method: "get",
  });
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getOrderPage(
  queryParams: OrderQuery
): AxiosPromise<PageResult<OrderPageVO[]>> {
  return request({
    url: "/customer/getAllOrder",
    method: "post",
    data: queryParams,
  });
}

//获取Good分页表 ！
export function getGoodPage(
  queryParams: GoodQuery
): AxiosPromise<PageResult<GoodPageVO[]>> {
  return request({
    url: "/distribute/good/getByOrderId",
    method: "post",
    data: queryParams,
  });
}

export function getGoodPage1(
  queryParams: CentralStationQuery
): AxiosPromise<PageResult<GoodPageVO[]>> {
  return request({
    url: "/distribute/central-station/getListByCondition",
    method: "post",
    data: queryParams,
  });
}

export function CreatOrderfunction(queryParams: CreatOrder) {
  return request({
    url: "/customer/addOrder",
    method: "post",
    data: queryParams,
  });
}
