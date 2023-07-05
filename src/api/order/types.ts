export interface OrderPageVO {
  id?: number;

  creater?: string;

  goodSum?: number;
}
export interface GoodPageVO {
  goodPrice:string;

  goodCost:string;

  goodClass:string;

  goodSubclass:string;

  keyId:string;

  goodName:string;

  goodNumber:number;

  goodStatus:string;


  
  

  classId:number;
  
 

  goodDate:string;

 

  



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
export interface Good{
  good_price: string,
  good_cost: string,
  good_subclass: string,
  key_id: string,
  class_id: string,
  remark: string,
  type: string,
  good_number: string,
  supply: string,
  sell_date: string,
  good_unit: string,
  is_return: string,
  good_factory: string,
  good_class: string,
  good_sale: string,
  is_change: string,
  good_name: string,
  username: string
}

export interface CreatOrder {

  Orders?:{
    explain?: string,
    order_type?: string,
    customer_address?: string,
    order_status?: string,
    postcode?: string,
    remark?: string,
    good_sum?: string,
    good_status?: string,
    order_date?: string,
    delivery_date?: string,
    substation?: string,
    mobilephone?: string,
    creater?: string,
    customer_name?: string,
    receive_name?:string,
    is_invoice?: string,
    customer_id?: string
  },
  Goods?:Good[]
}