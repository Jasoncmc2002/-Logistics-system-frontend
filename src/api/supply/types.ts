export interface SupplyPageVO {
  id?: number;
  supplySum?: number;
}

export interface SupplyQuery extends PageQuery {
  nameKeywords?: string;
  addrKeywords?: string;
  adminKeywords?: string;
  telKeywords?: string;
  status?: number;
}
export interface SupplyForm{
    id?:number;
    name?:string;
    address?:string;
    adminName?:string;
    phone?:string;
    bank?:string;
    bankNumer?:string;
    fax?:string;
    postcode?:string;
    legalPerson?:string;
    remark?:string;
  }
