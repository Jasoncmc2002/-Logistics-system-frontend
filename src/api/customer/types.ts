export interface CustomerPageVO {
    id?: number;
  
    creater?: string;
  
    goodSum?: number;
  }

  
  export interface CustomerForm {
    id?: number;
    addressphone?: string;
    unit?: string;
    address?: string;
    is_deleted?: string;
    idcard?: string;
    mobilephone?: string;
    name?: string;
    postcode?: string;
    email?: string;
  
    
  
  }
  
  export interface CustomerQuery extends PageQuery {
  
  }
  export interface CustomerQuery extends PageQuery {
    pageNum: number,
    pageSize: number,
    keyId?:number
  
  }
  