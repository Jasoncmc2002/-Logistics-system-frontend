import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CustomerPageVO, CustomerQuery,CustomerForm } from "./types";

/**
 * 获取顾客表单详情
 *
 * @param userId
 */
export function getCustomerForm(userId: number): AxiosPromise<CustomerForm> {
  return request({
    url: "/api/v1/users/" + userId + "/form",
    method: "get",
  });
}

/**
 * 获取顾客分页列表
 *
 * @param queryParams
 */
export function getCustomerPage(queryParams: CustomerQuery): AxiosPromise<PageResult<CustomerForm[]>> {
  return request({
    url: "/customer/search",
    method: "post",
    data: queryParams,
  });
}
/**
 * 添加用户
 *
 * @param data
 */
export function addCustomer(data: any) {
  return request({
    url: '/customer/addUser',
    method: 'post',
    data: data
  });
}
