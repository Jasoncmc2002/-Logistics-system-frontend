import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { SupplyForm, SupplyPageVO,SupplyQuery,
} from "./types";


export function getSupplyForm(id: number): AxiosPromise<SupplyForm> {
    return request({
      url: "/distribute/supply/"+id,
      method: "post",
    });
}
export function getSupplyPage(
        queryParams: SupplyQuery
      ): AxiosPromise<PageResult<SupplyPageVO[]>> {
        return request({
          url: "/distribute/supply/getListByCondition",
          method: "post",
          data: queryParams,
        });
      }

export function deleteSupplyForm(id: number) {
        return request({
          url: "/distribute/supply/delete/"+id,
          method: "post"
        });
      }
export function insertSupplyForm(params:SupplyForm) {
        return request({
          url: "/distribute/supply/create",
          method: "post",
          data:params,
        });
}
export function updateSupplyForm(params:SupplyForm) {
        return request({
          url: "/distribute/supply/update",
          method: "post",
          data:params,
});
}
// export function listRoleOptions(
//   queryParams?: SupplyQuery
// ): AxiosPromise<OptionType[]> {
//   return request({
//     url: '/api/v1/roles/options',
//     method: 'get',
//     params: queryParams
//   });
// }










