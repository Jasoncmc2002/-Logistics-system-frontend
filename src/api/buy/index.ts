import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BuyForm, BuyPageVO, BuyQuery } from "./types";

export function getBuyForm(id: number): AxiosPromise<BuyForm> {
  return request({
    url: "/distribute/buy/" + id,
    method: "post",
  });
}
export function getBuyPage(
  queryParams: BuyQuery
): AxiosPromise<PageResult<BuyPageVO[]>> {
  return request({
    url: "/distribute/buy/queryByDateSupply",
    method: "post",
    data: queryParams,
  });
}

export function deleteBuyForm(id: number) {
  return request({
    url: "/distribute/buy/delete/" + id,
    method: "post",
  });
}
export function insertBuyForm(params: BuyForm) {
  return request({
    url: "/distribute/buy/create",
    method: "post",
    data: params,
  });
}
export function updateBuyForm(params: BuyForm) {
  return request({
    url: "/distribute/buy/update",
    method: "post",
    data: params,
  });
}

export function withdrawal(params: { list: any }) {
  return request({
    url: "/distribute/buy/withdrawal",
    method: "post",
    data: params,
  });
}
