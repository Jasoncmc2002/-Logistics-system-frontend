import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { supplyData, SupplyQuery } from "./types";
import { UserForm, UserPageVO, UserQuery } from "@/api/user/types";

// export function pay(orderId: number, money: number,name : String) {
// 	return request({
// 		url: "/financial/alipay/pay?subject=" + name + "&traceNo=" + orderId + "&totalAmount=" + money,
// 		method: 'post'
// 	});
// }
export function pay(orderId: number, money: number, name: string) {
  return request({
    url: "/financial/alipay/pay",
    method: "post",
    data: {
      subject: name,
      traceNo: orderId,
      totalAmount: money,
    },
  });
}

export function getSupplyMoney(
  queryParams: SupplyQuery
): AxiosPromise<supplyData> {
  return request({
    url: "/financial/SettlementSupply",
    method: "post",
    data: queryParams,
  });
}
