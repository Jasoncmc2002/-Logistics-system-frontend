import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { invoicePageVO, invoiceQuery } from "./types";

export function getInvoice(
  queryParams: invoiceQuery
): AxiosPromise<invoicePageVO[]> {
  return request({
    url: "/financial/selectUseInvoice",
    method: "post",
    data: queryParams,
  });
}
// export function addInvoice(
// 		queryParams: invoice
// ): AxiosPromise {
// 	return request({
// 		url: "/financial/addUseInvoice",
// 		method: "post",
// 		data: queryParams,
// 	});
// }
