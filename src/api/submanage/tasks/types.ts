// 表单对应的数据结构
export interface TaskPageVO {
  /**
   * 订单号
   */
  orderId: number;
  /**
   * 任务号
   */
  id: number;
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
}

// Query请求用的数据结构
export interface TaskQuery extends PageQuery {
  /**
   * 所属分站
   */
  substation?: string | undefined | null;
  taskStatus?: string | undefined | null;
  taskType?: string | undefined | null;
  startLine?: string | undefined | null | Date;
  endLine?: string | undefined | null | Date;
}

/**
 * 分页项类型声明
 */
export type TaskPageResult = PageResult<TaskPageVO[]>;
