// 表单对应的数据结构
export interface TaskPageVO {
  /**
   * 订单号
   */
  orderId?: number;
  /**
   * 任务号
   */
  id?: number;
  /**
   * 分站
   */
  substation?: string;
  /**
   * 任务类型
   */
  taskType?: string;
  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 投递地址
   */
  address?: string;
  /**
   * 接收人姓名
   */
  receiveName?: string;
  /**
   * 要求完成日期
   */
  deadline?: string;
  /**
   * 商品总价值
   */
  goodSum?: number;
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
   * 分配人员
   */
  postman?: string;
}

// Query请求用的数据结构
export interface TaskQuery extends PageQuery {
  /**
   * 所属分站
   */
  substation?: string | undefined;
  taskStatus?: string | undefined;
  taskType?: string | undefined;
  startLine?: string | undefined | Date;
  endLine?: string | undefined | Date;
  postman?: string | undefined;
}

/**
 * 分页项类型声明
 */
export type TaskPageResult = PageResult<TaskPageVO[]>;

/**
 * 下拉栏所需要的数据 ： 任务种类
 */

export interface TaskType {
  taskType?: string;
}
