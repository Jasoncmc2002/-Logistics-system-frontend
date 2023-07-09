export interface FirstCategoryPageVO {
  id?: number;

  firstCategorySum?: number;
}
export interface SecondaryCategoryPageVO {
  id?: number;

  secondaryCategorySum?: number;
}

export interface CentralStationPageVO {
  id?: number;

  centralStationSum?: number;
}
export interface GoodPageVO {
  id?: number;

  goodSum?: number;
}
export interface GoodForm {
  id?: number;
  goodName?: string;
  goodNumber?: number;
  supply?: string;
}

export interface FirstCategoryForm {
  id?: number;
  fname?: string;
  description?: string;
}

export interface SecondaryCategoryForm {
  id?: number;
  sname?: string;
  fid?: number;
  fname?: string;
  description?: string;
}
export interface CentralStationForm {
  id?: number;
  goodClassId?: number;
  goodClassName?: string;
  goodSubclassId?: number;
  goodSubClassName?: string;
  goodName?: string;
  stock?: number;
  withdrawal?: number;
  waitAllo?: number;
  doneAllo?: number;
  warn?: number;
  max?: number;
  goodPrice?: number;
  goodSale?: number;
  goodCost?: number;
  goodUnit?: string;
  supplyId?: number;
  supplyName?: number;
  sellDate?: number;
  isReturn?: number;
  isReturnName?: string;
  isChange?: number;
  isChangeName?: string;
  remark?: string;
  stationId?: number;
  stationName?: string;
  vacancy?: number;
  goodFactory?: string;
}

export interface FirstCategoryQuery extends PageQuery {
  keywords?: string;
  status?: number;
}
export interface SecondaryCategoryQuery extends PageQuery {
  keywords?: string;
  status?: number;
  fId?: number;
}
export interface CentralStationQuery extends PageQuery {
  keywords?: string;
  status?: number;
  goodClassId?: number;
  goodSubclassId?: number;
  supplyId?: number;
}
export interface GoodQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
}
