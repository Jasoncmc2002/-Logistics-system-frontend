export interface OrderPageVO {
  id?: number;

  creater?: string;

  goodSum?: number;
}

export interface OrderForm {
  id: number;

  creater: string;

  goodSum: number;

  explain: string;

  remark: string;

  order_date: string;

  order_type: string;

  order_status: string;

  customer_address:string;

  customer_id: string;

  customer_name:string;

  receive_name:string;

  mobilephone:string;

  postcode:string;

  is_invoice:string;

  good_status:string;
  

}

export interface OrderQuery extends PageQuery {}
