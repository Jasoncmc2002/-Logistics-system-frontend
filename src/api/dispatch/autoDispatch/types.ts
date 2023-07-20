
////////////////////////////---Query---//////////////////////////////////
/**
 * 自动调度订单，根据订单类型，和时间范围查询订单信息
 */
export interface AutoQuery extends PageQuery {
  /**
   * 订单类型
   */
  orderType?: string;
  /**
   * 时间左界限
   */
  startTime?: string | Date;
  /**
   * 时间右界限
   */
  endTime?: string | Date;
  /**
   * 订单中货物的状态
   */
  goodStatus?: string;
}

export interface StationQuery extends PageQuery {

}

export type SubmitRequest = {
  Orders?: OrderPageVO[];
  deadline?: string | Date;
  allocationDate?: string | Date;
  creator?: string;
}
////////////
////////////////////////////---PageVO---//////////////////////////////////

// 订单详细信息表单对应的数据结构

export interface OrderPageVO { //
  /**
   * 订单号
   */
  id?: number;
  /**
   * 订单状态
   */
  orderStatus?: string;
  /**
   * 订单类型
   */
  orderType?: string;
  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 订单生成日期
   */
  orderDate?: string | Date;
  /**
   * 收货人
   */
  receiveName?: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * 分站名字
   */
  substationName?: string;
  /**
   * 分站ID
   */
  substationId?: number;
  /**
   * 要求出库日期
   */
  allocationDate?: string | Date;
  /**
   * 要求配送日期
   */
  deadline?: string | Date;
  /**
   * 录入员/创造者
   */
  creater?: string;
}

////////////////////////////---PageResult---//////////////////////////////////

export type OrderPageResult = PageResult<OrderPageVO[]>;

export type SubListResult = PageResult<SubstationInfo[]>;

////////////////////////////---other---//////////////////////////////////

/**
 * 自动调度分站信息返回的数据，一个id和一个名字
 */
export interface AutoResult{
  /**
   * 分站名字
   */
  substationName?: string;
  /**
   * 分站ID
   */
  substationId?: number;
}

/**
 * 用于存放分站信息
 */
export interface SubstationInfo{
  /**
   * 分站名称
   */
  name?: string;
  /**
   * 分站ID
   */
  id?: number;
}
