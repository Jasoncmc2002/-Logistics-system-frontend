export interface OrderPageVO {
  id?: number;

  creater?: string;

  goodSum?: number;
}
export interface GoodPageVO {
  
  id:number;

  classId:number;
  
  keyId:number;

  goodDate:string;

  goodClass:string;

  goodSubclass:string;

  goodName:string;

  goodNumber:number;



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
