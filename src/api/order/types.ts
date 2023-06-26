export interface OrderPageVO {
  id?: number;

  creater?: string;

  goodSum?: number;
}

export interface OrderForm {
  id: number;

  creater: string;

  goodSum: number;
}

export interface OrderQuery extends PageQuery {}
