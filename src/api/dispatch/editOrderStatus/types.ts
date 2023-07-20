
////////////////////////////---Query---//////////////////////////////////
/**
 * 自动调度订单，根据订单类型，和时间范围查询订单信息
 */
export interface EditOrderQuery extends PageQuery {
  /**
   * 时间左界限
   */
  startTime?: string | Date;
  /**
   * 时间右界限
   */
  endTime?: string | Date;
}
////////////////////////////---PageVO---//////////////////////////////////

// 订单详细信息表单对应的数据结构

export interface OrderPageVO { //
  /**
   * 订单号
   */
  orderId?: number;
  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * 邮编
   */
  postcode?: string;
  /**
   * 电话
   */
  phone?: string;
  /**
   * 订购日期
   */
  buyDate?: string | Date;
  
  /**
   * 订单状态
   */
  orderStatus?: string;
}

////////////////////////////---PageResult---//////////////////////////////////

export type OrderPageResult = PageResult<OrderPageVO[]>;

////////////////////////////---other---//////////////////////////////////
export interface UpdateData {
  id?: string;
  orderStatus?: string;
}