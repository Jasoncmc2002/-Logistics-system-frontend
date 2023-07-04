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

export interface FirstCategoryForm {
  id?:number;
  fname?:string;
  description?:string;
}

export interface SecondaryCategoryForm {
  id?:number;
  sname?:string;
  fid?:number;
  description?:string;
}
export interface CentralStationForm {
  id?:number;
  goodClassId?:number;

  goodSubclassId?:number;

  goodName?:string;
  stock?:number;
  withdrawal?:number;
  waitAllo?:number;
  doneAllo?:number;
  warn?:number;
  max?:number;
  goodPrice?:number;
  goodSale?:number;
  goodCost?:number;
  goodUnit?:string;
  supplyId?:number;
  sellDate?:number;
  isReturn?:number;
  isChange?:number;
  remark?:string;

}

export interface FirstCategoryQuery extends PageQuery {
  keywords?: string;
  status?: number;
}
export interface SecondaryCategoryQuery extends PageQuery {
  keywords?: string;
  status?: number;
  sId?: number;
}
export interface CentralStationQuery extends PageQuery {
  keywords?: string;
  status?: number;
  goodClassId?: number;
  goodSubclassId?: number;
  supplyId?:number;
}

