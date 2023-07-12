export interface OrderPageVO {
  id?: number;

  creater?: string;

  goodSum?: number;
}
export interface GoodPageVO {
  
  goodPrice: number;

  goodCost: string;

  goodClassName: string;

  goodSubClassName: string;

  goodFactory:string;

  goodSale:string;

  goodUnit:string;

  goodSubclass:string;

  goodName:string;

  goodNumber:number;

  id:number;


  classId: string;

  goodDate: string;

  remark:string;

  type:string;

  supplyName:string;
  
  isReturn:string;

  isChange:string;



}

export interface OrderForm {
  id?: number;

  creater?: string;

  goodSum?: number;

  explain?: string;

  remark?: string;

  order_date?: string;

  order_type?: string;

  order_status?: string;

  customer_address?:string;

  customer_id?: string;

  customer_name?:string;

  receive_name?:string;

  mobilephone?:string;

  postcode?:string;

  is_invoice?:string;

  good_status?:string;
  

}
export interface GoodForm {
  id: number;

  creater: string;

  goodSum: number;

  explain: string;

  remark: string;

  order_date: string;

  order_type: string;

  order_status: string;

  customer_address:string;

}

export interface OrderQuery extends PageQuery {
	pageNum: number,
	pageSize: number,
	customerName:string,
	id:number,
	receiveName:string,
	startTime:string,
	endTime:string,
  orderType:string
  
}
//search by key id
export interface GoodQuery extends PageQuery {
  pageNum: number,
  pageSize: number,
  keyId?:number

}
//search by good info
export interface GoodQuery1 extends PageQuery {

  pageNum: number,
  pageSize: number,
  goodClassId:string;
  goodSubclassId:string;
  keywords:string;

}

export interface Good {
  goodPrice?: number;
  goodCost?: string;
  goodId?:number;
  goodSubclass?: string;
  keyId?: string;
  classId?: string;
  remark?: string;
  type?: string;
  goodNumber?: number;
  supply?: string;
  sellDate?: string;
  goodUnit?: string;
  isReturn?: string;
  goodFactory?: string;
  goodClass?: string;
  goodSale?: string;
  isChange?: string;
  goodName?: string;
  username?: string;
}

export interface CreatOrder {
  Orders: {
    explain?: string;
    orderType?: string;
    customerAddress?: string;
    orderStatus?: string;
    postcode?: string;
    remark?: string;
    goodSum: number;
    goodStatus?: string;
    orderDate?: string;
    deliveryDate?: string;
    substation?: string;
    mobilephone?: string;
    creater?: string;
    customerName?: string;
    receiveName?: string;
    isInvoice?: string;
    customerId?: string;
  };
  Goods: Good[];
}

export interface EditOrder {
    id:number;

    explain?: string;

    orderType?: string;

    customerAddress?: string;


    postcode?: string;
  
    
    deliveryDate?: string;

    substation?: string;

    mobilephone?: string;
    
    receiveName?: string;

    isInvoice?: string;
    
  
}

export interface CancelOrder {
  id?:number;

  orderStatus?:string;
  

}




export interface judgeStock{

   id?:number;
   goodNumber?:number;

}