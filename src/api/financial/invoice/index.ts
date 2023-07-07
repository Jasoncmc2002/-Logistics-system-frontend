import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { invoice, invoicePageVO, invoiceQuery } from "./types";

export function getInvoice(
  queryParams: invoiceQuery
): AxiosPromise<invoicePageVO[]> {
  return request({
    url: "/financial/selectInvoice",
    method: "post",
    data: queryParams,
  });
}
export function addInvoice(queryParams: invoice): AxiosPromise {
  return request({
    url: "/financial/addInvoice",
    method: "post",
    data: queryParams,
  });
}
