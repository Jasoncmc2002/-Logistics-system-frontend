// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { ReceiptParams, GoodQuery , GoodPageResult , ReceiptQuery , ReceiptPageResult  , TaskId} from "./types";
import { pa } from "element-plus/es/locale";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getReceiptListByCriteria(
  queryParams: ReceiptQuery
): AxiosPromise<ReceiptPageResult> {
  return request({
    url: "/substation/receipt/selectReceiptByCriteria",
    method: "post",
    data: queryParams,
  });
}

/**
 * 提交回执
 */
export function submitReceipt(
  param: ReceiptParams
):void{
  request({
    url: "/substation/receipt/receiptEntry",
    method: "post",
    data: param
  })
}

/**
 * 根据任务单号查询商品列表
 */
export function getGoodDetailAPI(
  queryParams : GoodQuery
): AxiosPromise<GoodPageResult>{
  return request({
    url: "/dispatch/getGoodListByOrderId",
    method: "post",
    data: queryParams
  })
}

/**
 * 根据任务单号查询商品列表
 */
export function getOrderIdByTaskId(
  queryParams : TaskId
): AxiosPromise<string>{
  return request({
    url: "/substation/task/getOrderIdByTaskId",
    method: "post",
    data: queryParams
  })
}