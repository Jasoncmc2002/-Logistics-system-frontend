import request from "@/utils/request";
import {AxiosPromise} from "axios";
import {CentralStationForm, CustomerForm} from "./types";


/**
 * 添加用户
 *
 * @param data
 */
export function updateUser(data: CustomerForm ){
  return request({
    url: '/customer/updateUser',
    method: 'post',
    data: data
  });
}

export function getCustomer(data: number ):  AxiosPromise<CustomerForm>{
	return request({
		url: '/customer/getUserByUserId',
		method: 'post',
		data: data
	});
}
export function addCustomer(data: any) {
	return request({
		url: '/customer/addUser',
		method: 'post',
		data: data
	});
}


export async function getAiliGood(
		file: File,
): AxiosPromise<CentralStationForm> {
	const formData = new FormData();
	formData.append("file", file);
	return request({
		url: "/financial/goodAili",
		method: "post",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}
