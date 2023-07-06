export interface BuyPageVO {
  id?: number;
  supplySum?: number;
}

export interface BuyQuery extends PageQuery {
  id?: string;
  startTime?: string;
  endTime?: string;
  supplyName?: string;
  status?: number;
}
export interface BuyForm {
  id?: number;
  goodClass?: string;
  goodId?: string;
  goodName?: string;
  goodUnit?: string;
  supply?: string;
  number?: number;
  date?: string;
  type?: number;
  typeName?: string;
  buyType?: number;
  buyTypeName?: string;
  orderId?: string;
  waitAllo?: number;
  withdrawal?: number;
}
