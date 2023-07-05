// request , AxiosPromise 为必须导入的内容
import request from "@/utils/request";
import { AxiosPromise } from "axios";
// 按照需求导入相应的数据类型或者需要的连表类型
import { TaskPageVO, TaskQuery, TaskPageResult } from "./types";

/**
 * 字典类型分页列表
 *
 * @param queryParams
 */
export function getTaskListByCriteria(
  queryParams: TaskQuery
): AxiosPromise<TaskPageResult> {
  return request({
    url: "/substation/task/getTaskListByCriteria",
    method: "post",
    data: queryParams,
  });
}
