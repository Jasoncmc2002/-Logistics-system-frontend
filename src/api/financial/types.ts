/**
 * 文件API类型声明
 */
export interface FileInfo {
  name: string;
  url: string;
}

export interface MoneyQuery extends PageQuery {
	station?: string;
	endTime?: Date;
	startTime?: Date;
}
/*分站缴费表的表单*/
export interface moneyPageVO {
	/**
	 * 用户头像地址
	 */
  id?: number;
	goodClass?: string;
	goodName?: string;
	goodGetNumber?: number;
	goodGetMoney?: number;
	goodReturnNumber?: number;
	goodReturnMoney?: number;
}
