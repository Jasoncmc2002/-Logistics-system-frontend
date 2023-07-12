// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { EditOrderQuery , OrderPageResult } from "./types";
import { pa } from "element-plus/es/locale";

/**
 * 按照参数查询订单信息列表
 */
export function getOrderListByCriteria(
  queryParams: EditOrderQuery
): AxiosPromise<OrderPageResult> {
  return request({
    url: "",
    method: "post",
    data: queryParams
  })
}

/**
 * 提交状态改变
 */
export function submitChangeOrderStatus(){
  
}