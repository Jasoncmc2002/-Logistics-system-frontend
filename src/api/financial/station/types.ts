export interface StationQuery extends PageQuery {
  station: string;
  endTime: Date;
  startTime: Date;
}
/*分站缴费表的表单*/
export interface stationPageVO {
  id: string;
  goodClass: string;
  goodName: string;
  goodGetNumber: number;
  goodGetMoney: number;
  goodReturnNumber: number;
  goodReturnMoney: number;
}
export interface stationData {
  datalist: PageResult<stationPageVO[]>;
  sumMoney: number;
  getMoney: number;
  returnMoney: number;
}
