export interface PostmanForm {
  /**
   * 订单号
   */
  id?: number;
  /**
   * 配送人员名称
   */
  postmanName?: string;
  /**
   * 配送人员电话号
   */
  postmanPhonenum?: string;
  /**
   * 配送人员所在分站名称
   */
  postmanStation?: string;
}

/**
 * 分页项类型声明
 */
export type PostmanPageResult = PageResult<PostmanForm[]>;

// Query请求用的数据结构
export interface PostmanQuery extends PageQuery {
  /**
   * 所属分站
   */
}
