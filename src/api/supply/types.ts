export interface SupplyPageVO {
  id?: number;
  supplySum?: number;
}

export interface SupplyQuery extends PageQuery {
  nameKeywords?: string | null;
  addrKeywords?: string | null;
  adminKeywords?: string | null;
  telKeywords?: string | null;
  status?: number | null;
}
export interface SupplyForm {
  id?: number;
  name?: string;
  address?: string;
  adminName?: string;
  phone?: string;
  bank?: string;
  bankNumer?: string;
  fax?: string;
  postcode?: string;
  legalPerson?: string;
  remark?: string;
}
