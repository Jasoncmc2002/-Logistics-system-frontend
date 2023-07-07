export interface invoiceQuery extends PageQuery {
  invoiceNumber: number;
  endTime: Date;
  startTime: Date;
  username: string;
}
/*分站缴费表的表单给后,发票登记的表，给后端*/
export interface invoicePageVO {
  type: string;
  orderId: number;
  number: number;
  money: number;
  batch: number;
  name: string;
  date: Date;
}

// export interface invoice {
// 	invoiceId: number;
// 	orderId: number;
// 	number: number;
// 	money: number;
// 	batch: number;
// 	name: string;
// }
