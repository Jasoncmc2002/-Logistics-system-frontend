import request from "@/utils/request";
import {AxiosPromise} from "axios";
import {CaptchaResult, LoginData, LoginResult, SignInData} from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */

export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: "/api/v1/auth/login",
    method: "post",
    params: data,
  });
}
export function signApi(data: SignInData){
	return request({
		url: "/api/v1/users/signIn",
		method: "post",
		params: data,
		data: data,
	});
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/api/v1/auth/logout",
    method: "delete",
  });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}
