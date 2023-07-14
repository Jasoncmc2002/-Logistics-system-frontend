// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { BuyQuery , BuyPageResult, InOutStation, AllocationQuery , AllocationPageResult, DetailQuery, DetailPageResult, CenterOutData, InOutQuery , SubInData , DefaultRespond , AllocationPageResultByID, AllocationData, AlloQuery, ReceiveQuery, GoodPageResult, ReceiveQueryResult, SubmitReceiveData, GoodQuery, SubOutData} from "./types";
import { pa } from "element-plus/es/locale";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getAlloListByKey(
  queryParams: AlloQuery
): AxiosPromise<AllocationPageResult> {
  return request({
    url: "/dispatch/getAllocation",
    method: "post",
    data: queryParams,
  });
}


/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getGoodListByAlloId(
  queryParams: GoodQuery
): AxiosPromise<GoodPageResult> {
  return request({
    url: "/dispatch/getGoodListByAlloId",
    method: "post",
    data: queryParams,
  });
}

/**
 * 提交分站出库
 */
export function subOutDataSubmit(
  subOutData: SubOutData
): AxiosPromise<DefaultRespond>{
  return request({
    url: "/warehouse/centralcontroller/returnGoodsOutSub",
    method: "post",
    data: subOutData
  })
}

//////////////////////记得删///////////////////

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

export function getAllocationById(
  queryParams: InOutQuery
): AxiosPromise<AllocationPageResultByID>{
  return request({
    url: "/dispatch/getGoodListByAlloId",
    method: "post",
    data: queryParams,
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
 * 得到allocation的显示用的数据
 */
export function getAllocationDataById(
  queryParams: AlloQuery
): AxiosPromise<AllocationData>{
  return request({
    url: "/dispatch/getByAlloId",
    method: "post",
    data: queryParams
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

/**
 * 提交分站入库
 */
export function subInSubmit(
  param: SubInData
): void{
  request({
    url: "/warehouse/centralcontroller/inSubstation",
    method: "post",
    data: param
  })
}


////////////////////////领货//////////////////////////

/**
 * 确认领货
 */
export function submitReceive(
  submitData: SubmitReceiveData
): void{
  request({
    url: "warehouse/centrolcontroller/takeGoods",
    method: "post",
  })
}