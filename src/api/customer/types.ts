export interface CustomerPageVO {
  id?: number;

  addressphone?: string;
  work?: string;
  address?: string;
  isDeleted?: number;
  idcard?: string;
  mobilephone?: string;
  name?: string;
  postcode?: string;
  email?: string;
}

export interface CustomerForm {
  id?: number;
  addressphone?: string;
  work?: string;
  address?: string;
  is_deleted?: string;
  idcard?: string;
  mobilephone?: string;
  name?: string;
  postcode?: string;
  email?: string;
}

export interface CustomerQuery extends PageQuery {
  mobilephone?: string;
  idcard?: string;
  name?: string;
}
