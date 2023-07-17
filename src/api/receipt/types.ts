export interface ReceiptForm {
  id?: number;
  replyClass?: number;
  customerName?: string;
  mobilephone?: string;
  substation?: string;
  taskType?: string;
  address?: string;
  goodName?: string;
  number?: number;
  price?: number;
  taskStatus?: string;
  customerSatis?: string;
  remark?: string;
  goodSum?: number;
  invoiceNumber?: number;
  postman?: string;
}
export interface ReceiptQuery extends PageQuery {}
export interface ReceiptPageVO {}
