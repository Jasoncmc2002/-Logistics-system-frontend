// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { AutoQuery , OrderPageResult , AutoResult, OrderPageVO, StationQuery, SubListResult, SubmitRequest } from "./types";
import { pa } from "element-plus/es/locale";
import { DefaultRespond } from "@/api/warehouse/types";

/**
 * 按照参数查询订单信息列表
 */
export function getOrderListByCriteria(
  queryParams: AutoQuery
): AxiosPromise<OrderPageResult> {
  return request({
    url: "/customer/getOrderDis",
    method: "post",
    data: queryParams
  })
}

/**
 * 返回一个自动调度后得到的分站id和名称
 */
export function getAutoDispatch(): AxiosPromise<AutoResult> {
  return request({
    url: "",
    method: "post"
  })
}

/**
 * 提交调度信息
 */
export function submitDispatch(
  orderList: SubmitRequest
): AxiosPromise<DefaultRespond>{
  return request({
    url: "/dispatch/insertTaskDispatchlist",
    method: "post",
    data: orderList
  })
}

/**
 * 得到所有分站的名字和ID
 */
export function getAllSubstation(queryParams: StationQuery): AxiosPromise<SubListResult> {
  return request({
    url: "/distribute/station/getList",
    method: "post",
    data: queryParams
  })
}
