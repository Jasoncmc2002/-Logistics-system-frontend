import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {FileInfo, moneyPageVO, MoneyQuery} from './types';
import {UserForm, UserPageVO, UserQuery} from "@/api/user/types";




export function getMoney(
		queryParams: MoneyQuery
): AxiosPromise<PageResult<moneyPageVO[]>> {
	return request({
		url: '/financial/SettlementSupply',
		method: 'post',
		params: queryParams
	});
}
