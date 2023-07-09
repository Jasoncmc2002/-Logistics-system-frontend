import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ReceiptForm, ReceiptPageVO, ReceiptQuery } from "./types";

export function getReceiptPage(
  queryParams: ReceiptQuery
): AxiosPromise<PageResult<ReceiptPageVO[]>> {
  return request({
    url: "/substation/receipt/getReceiptList",
    method: "post",
    data: queryParams,
  });
}
