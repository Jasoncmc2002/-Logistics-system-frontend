// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { PostmanForm, PostmanPageResult, PostmanQuery } from "./types";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getAllPostman(
  queryParams: PostmanQuery
): AxiosPromise<PostmanPageResult> {
  return request({
    url: "/substation/postman/selectAllPostman",
    method: "post",
    data: queryParams,
  });
}
