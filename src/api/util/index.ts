// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 字典类型分页列表
 *
 */
export function getUUID(): AxiosPromise<string> {
  return request({
    url: "/customer/getUUId",
    method: "post"
  });
}