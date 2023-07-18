////////////////////////////---Query---//////////////////////////////////


// Query请求用的数据结构
export interface ReceiptQuery extends PageQuery {
  taskType?: string | undefined;
  startLine?: string | undefined | Date;
  endLine?: string | undefined | Date;
}

// 查询商品详情时的请求体
export interface GoodQuery extends PageQuery {
  /**
   * 订单号
   */
  orderId?: string;
}

////////////////////////////---SubmitData---//////////////////////////////////


// 回执单详细信息相关数据存储体
export interface ReceiptParams {
  /**
   * 订单号
   */
  orderId?: number;
  /**
   * 任务号
   */
  id?: number;
  /**
   * 分站代号？
   */
  subId?: number;
  /**
   * 分站
   */
  substation?: string;
  /**
   * 任务类型
   */
  taskType?: string;
  /**
   * 任务单日期
   */
  taskDate?: string | Date;
  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 客户地址
   */
  customerAddress?: string;
  /**
   * 客户电话
   */
  customerPhone?: string;
  /**
   * 商品总价值
   */
  goodSum?: number;
  /**
   * 接收人姓名
   */
  receiveName?: string;
  /**
   * 送货地址
   */
  address?: string;
  /**
   * 分配人员
   */
  postman?: string;
  /**
   * 要求完成日期
   */
  deadline?: string;
  /**
   * 送到日期
   */
  endDate?: string;
  /**
   * 任务状态
   */
  taskStatus?: string;
  /**
   * 是否要发票
   */
  isInvoice?: number;
  /**
   * 签收单号
   */
  receiptId?: string;
  /**
   * 客户签字
   */
  sign?: string;
  /**
   * 客户反馈
   */
  customerSatis?: string;
  /**
   * 回执类型：目前与任务类型统一
   */
  replyClass?: string;
  /**
   * 备注
   */
  remark?: string;
}


////////////////////////////---PageVO---//////////////////////////////////

// 回执对应的数据结构
export interface ReceiptPageVO {
  /**
   * 回执单ID
   */
  id?: number;
  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 客户电话
   */
  mobilephone?: string;
  /**
   * 分站
   */
  substation?: string;
  /**
   * 任务类型
   */
  taskType?: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * 价格
   */
  price?: number;
  /**
   * 任务状态
   */
  taskStatus?: string;
  /**
   * 客户满意度
   */
  customerSatis?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 任务号
   */
  taskId?: number;
}


// 显示详情时使用的商品页面数据
export interface GoodPaageVO {
  /**
   * 商品名称
   */
  goodName?: string;
  /**
   * 商品数量
   */
  goodNumber?: string;
}
////////////////////////////---PageResult---//////////////////////////////////

/**
 * 分页项类型声明
 */
export type ReceiptPageResult = PageResult<ReceiptPageVO[]>;

/**
 * 分页项类型声明
 */
export type GoodPageResult = PageResult<GoodPaageVO[]>;
////////////////////////////---Others---//////////////////////////////////

/**
 * 下拉栏所需要的数据 ： 任务种类
 */

export interface TaskType {
  taskType?: string;
}

export interface TaskId {
  taskId?: string;
}