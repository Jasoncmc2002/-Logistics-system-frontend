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
  EditOrder,
  CancelOrder,
  judgeStock,
} from "./types";
import { CentralStationQuery } from "@/api/good/types";
/**
 * 获取用户表单详情
 *
 * @param userId
 */

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

export function AddOrderGoodfunction(queryParams: CreatOrder) {
  return request({
    url: "/customer/addOrderGood",
    method: "post",
    data: queryParams,
  });
}

export function EditOrderfunction(queryParams: EditOrder){
  return request({
    url: "/customer/updateOrder",
    method: "post",
    data: queryParams,
  });
}

export function CancelOrderfunction(queryParams: CancelOrder){
  return request({
    url: "/customer/changeOrderStatusById",
    method: "post",
    data: queryParams,
  });
}

export function getOrderPageByCondition(
	queryParams: OrderQuery
): AxiosPromise<PageResult<OrderPageVO[]>> {
	return request({
		url: "/customer/getOrdersByCriteria",
		method: "post",
		data: queryParams,
	});
}

export function judgeStokeMethod(queryParams: judgeStock){
  return request({
    url: "/distribute/central-station/check",
    method: "post",
    data: queryParams,
  });

}
