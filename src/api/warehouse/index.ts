// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { BuyQuery , BuyPageResult, InOutStation, AllocationQuery , AllocationPageResult, DetailQuery, DetailPageResult, CenterOutData } from "./types";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getBuyListByCriteria(
  queryParams: BuyQuery
): AxiosPromise<BuyPageResult> {
  return request({
    url: "/warehouse/centralcontroller/searchInCentral",
    method: "post",
    data: queryParams,
  });
}

export function getAllocationByCriteria(
  queryParams: AllocationQuery
): AxiosPromise<AllocationPageResult> {
  return request({
    url: "/dispatch/getAllocation",
    method: "post",
    data: queryParams
  })
}

export function getDetailsByOrderId (
  queryParams: DetailQuery
): AxiosPromise<DetailPageResult>{
  return request({
    url: "/dispatch/getGoodListByOrderId",
    method: "post",
    data: queryParams,
    
  })
}

/**
 * 提交入库
 */
export function submitCenterIn(
  inOut: InOutStation
):void{
  request({
    url: "/warehouse/centralcontroller/inCentral",
    method: "post",
    data: inOut
  })
}

/**
 * 提交出库
 */
export function submitCenterOut(
  centerOut: CenterOutData
): void {
  request({
    url: "/warehouse/centralcontroller/outCentral",
    method: "post",
    data: centerOut
  })
}


