import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { OrderForm, OrderPageVO, OrderQuery } from "./types";

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
