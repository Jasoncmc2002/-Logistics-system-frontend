// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { AutoQuery , OrderPageResult , AutoResult, OrderPageVO, SubstationInfo, StationQuery, SubListResult, SubmitRequest } from "./types";
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

////////////////////////---复制过来的记得删除---//////////////////////////
// /**
//  * 字典类型分页列表
//  *
//  * @param queryParams
//  */
// export function getBuyListByCriteria(
//   queryParams: BuyQuery
// ): AxiosPromise<BuyPageResult> {
//   return request({
//     url: "/warehouse/centralcontroller/searchInCentral",
//     method: "post",
//     data: queryParams,
//   });
// }

// export function getAllocationByCriteria(
//   queryParams: AllocationQuery
// ): AxiosPromise<AllocationPageResult> {
//   return request({
//     url: "/dispatch/getAllocation",
//     method: "post",
//     data: queryParams
//   })
// }

// export function getAllocationById(
//   queryParams: InOutQuery
// ): AxiosPromise<AllocationPageResultByID>{
//   return request({
//     url: "/dispatch/getGoodListByAlloId",
//     method: "post",
//     data: queryParams,
//   })
// }

// export function getDetailsByOrderId (
//   queryParams: DetailQuery
// ): AxiosPromise<DetailPageResult>{
//   return request({
//     url: "/dispatch/getGoodListByOrderId",
//     method: "post",
//     data: queryParams,
    
//   })
// }

// /**
//  * 得到allocation的显示用的数据
//  */
// export function getAllocationDataById(
//   queryParams: AlloQuery
// ): AxiosPromise<AllocationData>{
//   return request({
//     url: "/dispatch/getByAlloId",
//     method: "post",
//     data: queryParams
//   })
// }

// /**
//  * 提交入库
//  */
// export function submitCenterIn(
//   inOut: InOutStation
// ):void{
//   request({
//     url: "/warehouse/centralcontroller/inCentral",
//     method: "post",
//     data: inOut
//   })
// }

// /**
//  * 提交出库
//  */
// export function submitCenterOut(
//   centerOut: CenterOutData
// ): void {
//   request({
//     url: "/warehouse/centralcontroller/outCentral",
//     method: "post",
//     data: centerOut
//   })
// }

// /**
//  * 提交分站入库
//  */
// export function subInSubmit(
//   param: SubInData
// ): void{
//   request({
//     url: "/warehouse/centralcontroller/inSubstation",
//     method: "post",
//     data: param
//   })
// }


// ////////////////////////领货//////////////////////////
// /**
//  * 字典类型分页列表
//  *
//  * @param queryParams
//  */
// export function getGoodListByTaskId(
//   queryParams: ReceiveQuery
// ): AxiosPromise<ReceiveQueryResult> {
//   return request({
//     url: "/dispatch/getDelivery",
//     method: "post",
//     data: queryParams,
//   });
// }
