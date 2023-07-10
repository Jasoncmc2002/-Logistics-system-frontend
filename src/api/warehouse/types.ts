// 表单对应的数据结构
export interface BuyPageVO {
  /**
   * 供应商
   */
  supply?: string;
  /**
   * 购货日期
   */
  buyDate?: string;
  /**
   * 商品名称
   */
  goodName?: string;
  /**
   * 一级类别
   */
  goodClass?: string;
  /**
   * 二级类别
   */
  goodSubclass?: string;
  /**
   * 商品单位
   */
  goodUnit?: string;
  /**
   * 应入库数量
   */
  buyNumber?: number;
  /**
   * 实际入库数量
   */
  number?: number;
  /**
   * 商品id
   */
  centralGoodId?: number;
}

export interface AllocationPageVO {
  /**
   * 调拨单号
   */
  id?: number;
  /**
   * 订单号
   */
  orderId?: number;
  /**
   * 出库库房
   */
  outStation?: string;
  /**
   * 入库库房
   */
  inStation?: string;
  /**
   * 出库日期 
   */
  allocationDate?: string|Date;
}

export interface DetailPageVO {
  /**
   * 商品名称
   */
  goodName?: string;
  /**
   * 出库数量
   */
  goodNumber?: number;
}
// Query请求用的数据结构
export interface BuyQuery extends PageQuery {
  /**
   * 购入单号
   */
  id?: string;
}

export interface AllocationQuery extends PageQuery {
  /**
   * 时间左界限
   */
  startLine?: string|Date;
  endLine?: string|Date;
  alloType: number;
}

export interface DetailQuery extends PageQuery {
  /**
   * 订单号
   */
  orderId?: number;
}


/**
 * 分页项类型声明
 */
export type BuyPageResult = PageResult<BuyPageVO[]>;

export type AllocationPageResult = PageResult<AllocationPageVO[]>;

export type DetailPageResult = PageResult<DetailPageVO[]>;

/**
 * 形成出入库单所需要的参数
 */
export interface  InOutStation {
  /**
   * 货物id
   */
  goodId?: number;
  /**
   * 签收人
   */
  signer?: string;
  /**
   * 签收日期
   */
  date?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 实际入库数量
   */
  number?: number;
  /**
   * 供应商
   */
  supply?: string;
  /**
   * 购货日期
   */
  buyDate?: string;
  /**
   * 商品名称
   */
  goodName?: string;
}

/**
 * 出库需要的数据
 */
export interface CenterOutData{
  /**
   * 调拨单号
   */
  alloId?: number;
  /**
   * 分发人
   */
  distributor?: string;
  /**
   * 签收人
   */
  signer?: string;
  /**
   * 分发日期
   */
  date?: string|Date;
  /**
   * 调拨单对应订单对应的货物信息 
   */
  goods?: DetailPageVO[];
  /**
   * 订单id
   */
  orderId?: number;
  /**
   * 备注
   */
  remark?: string;
}


