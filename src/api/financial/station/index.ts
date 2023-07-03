import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {stationData, StationQuery} from './types';



export function getStationMoney(
		queryParams: StationQuery
): AxiosPromise<stationData> {
	return request({
		url: '/financial/SettlementSupply',
		method: 'post',
		params: queryParams
	});
}
