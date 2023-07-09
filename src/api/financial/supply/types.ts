export interface SupplyQuery extends PageQuery {
  supplyName: string;
  endTime: Date;
  startTime: Date;
  buyType: string;
}
/*供应商的结算表单*/
export interface supplyPageVO {
  id: string;
  goodName: string;
  goodPrice: string;
  goodCost: number;
  goodSupplyNumber: number;
  goodReturnNumber: number;
  goodSettleNumber: number;
  goodSettleMoney: number;
  goodType: string;
}

export interface supplyData {
  datalist: PageResult<supplyPageVO[]>;
  sumMoney: number;
}
