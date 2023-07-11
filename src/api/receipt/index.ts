import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ReceiptForm, ReceiptPageVO, ReceiptQuery } from "./types";

export function getReceiptPage(): AxiosPromise<PageResult<ReceiptPageVO[]>> {
  return request({
    url: "/substation/receipt/getReceiptList",
    method: "post",
  });
}
export function exportExcel() {
  return request({
    url: "/distribute/station/exportExcel",
    method: "post",
    responseType: "arraybuffer",
  });
}
