export interface invoiceQuery extends PageQuery {
  invoiceNumber: number;
  endTime: Date;
  startTime: Date;
  invoiceStartNumber: number;
  invoiceEndNumber: number;
  invoiceClass: string;
}
/*分站缴费表的表单给后,发票登记的表，给后端*/
export interface invoicePageVO {
  id: number;
  invoiceClass: string;
  startNumber: number;
  endNumber: number;
  batch: number;
  name: string;
  date: Date;
}

export interface invoice {
  invoiceClass: string;
  startNumber: number;
  endNumber: number;
  batch: number;
  name: string;
}
