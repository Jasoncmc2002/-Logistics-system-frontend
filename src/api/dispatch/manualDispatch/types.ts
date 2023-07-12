
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

export interface StationQuery extends PageQuery {}

export type SubmitRequest = {
  Orders?: OrderPageVO[];
  deadline?: string | Date;
  allocationDate?: string | Date;
  creator?: string;
}
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

////////////////////////////---复制过来的记得删除---//////////////////////////////////

// // 表单对应的数据结构
// export interface BuyPageVO {
//   /**
//    * 供应商
//    */
//   supply?: string;
//   /**
//    * 购货日期
//    */
//   buyDate?: string;
//   /**
//    * 商品名称
//    */
//   goodName?: string;
//   /**
//    * 一级类别
//    */
//   goodClass?: string;
//   /**
//    * 二级类别
//    */
//   goodSubclass?: string;
//   /**
//    * 商品单位
//    */
//   goodUnit?: string;
//   /**
//    * 应入库数量
//    */
//   buyNumber?: number;
//   /**
//    * 实际入库数量
//    */
//   number?: number;
//   /**
//    * 商品id
//    */
//   centralGoodId?: number;
// }

// export interface AllocationPageVO {
//   /**
//    * 调拨单号
//    */
//   id?: number;
//   /**
//    * 订单号
//    */
//   orderId?: number;
//   /**
//    * 出库库房
//    */
//   outStationName?: string;
//   /**
//    * 入库库房
//    */
//   inStationName?: string;
//   /**
//    * 出库日期 
//    */
//   allocationDate?: string|Date;
// }

// export interface DetailPageVO {
//   /**
//    * 商品名称
//    */
//   goodName?: string;
//   /**
//    * 出库数量
//    */
//   goodNumber?: number;
// }
// // Query请求用的数据结构
// export interface BuyQuery extends PageQuery {
//   /**
//    * 购入单号
//    */
//   id?: string;
// }

// export interface AllocationQuery extends PageQuery {
//   /**
//    * 时间左界限
//    */
//   startLine?: string|Date;
//   endLine?: string|Date;
//   alloType: number;
// }

// export interface DetailQuery extends PageQuery {
//   /**
//    * 订单号
//    */
//   orderId?: number;
// }

// export interface AlloQuery {
//   /**
//    * 调拨单号
//    */
//   id?: number;
//   /**
//    * type
//    */
//   alloType?: number;
// }


// /**
//  * 分页项类型声明
//  */
// export type BuyPageResult = PageResult<BuyPageVO[]>;

// export type AllocationPageResult = PageResult<AllocationPageVO[]>;

// export type DetailPageResult = PageResult<DetailPageVO[]>;

// /**
//  * 形成出入库单所需要的参数
//  */
// export interface  InOutStation {
//   /**
//    * 货物id
//    */
//   goodId?: number;
//   /**
//    * 签收人
//    */
//   signer?: string;
//   /**
//    * 签收日期
//    */
//   date?: string;
//   /**
//    * 备注
//    */
//   remark?: string;
//   /**
//    * 实际入库数量
//    */
//   number?: number;
//   /**
//    * 供应商
//    */
//   supply?: string;
//   /**
//    * 购货日期
//    */
//   buyDate?: string;
//   /**
//    * 商品名称
//    */
//   goodName?: string;
// }

// /**
//  * 出库需要的数据
//  */
// export interface CenterOutData{
//   /**
//    * 调拨单号
//    */
//   alloId?: number;
//   /**
//    * 分发人
//    */
//   distributor?: string;
//   /**
//    * 签收人
//    */
//   signer?: string;
//   /**
//    * 分发日期
//    */
//   date?: string|Date;
//   /**
//    * 调拨单对应订单对应的货物信息 
//    */
//   goods?: DetailPageVO[];
//   /**
//    * 订单id
//    */
//   orderId?: number;
//   /**
//    * 备注
//    */
//   remark?: string;
// }

// export interface InOutQuery extends PageQuery{
//   /**
//    * 出入库单对应id
//    */
//   id?: number;
//   /**
//    * 调度单状态（类型
//    */
//   alloType?: number;
// }

// /**
//  * 出入库页面数据结果
//  */
// export type AllocationPageResultByID = PageResult<GoodPageVO[]>;

// /**
//  * 出入库页面数据
//  */
// export interface GoodPageVO {   	
//   /**
//    * 商品名称
//    */
//   goodName?: string;
//   /**
//    * 一级类别
//    */
//   goodClass?: string;
//   /**
//    * 二级类别
//    */
//   goodSubClass?: string;
//   /**
//    * 商品单位
//    */
//   goodUnit?: string;
//   /**
//    * 应入库数量
//    */
//   number?: number;
//   /**
//    * 实际入库数量
//    */
//   realNumber?: number;

// }

// /**
//  * 分站入库需要的数据
//  */
// export interface  SubInData{
//   /** 
//    * 分站库房
//    */

//   stationName?: string;

//   /**
//    * 分发人
//    */
  
//   distributor?: string;

//   /**
//    * 签收人
//    */

//   signer?: string;

//   /**
//    * 签收日期
//    */

//   date?: string | 	Date;

//   /**
//    * 备注
//    */

//   remark?: string;

//   /**
//    * 商品信息
//    */

//   goods?: GoodPageVO[];

//   /**
//    * 调度单ID
//    */

//   alloId?: number;  

//   /**
//    * 任务单ID
//    */
//   taskId?: number;

//   /**
//    * 入库分站的ID
//    */
//   stationId?: number;
// }

// /**
//  *  配送单相关需要展示的数据
//  */
// export interface AllocationData{
//   /**
//    * 分站库房
//    */
//   inStationName?: string;
//   /**
//    * 分发人
//    */
//   distributors?: string;
//   /**
//    * 入库分站的ID
//    */
//   inStationId?: number;
//   /**
//    * 任务单ID
//    */
//   taskId?: number;  
  
// }

// ///////////////////////////////领货///////////////////////////////////////
// /**
//  * 领货查询
//  */
// export interface ReceiveQuery extends PageQuery{
//   /**
//    * 任务单ID
//    */
//   taskId?: number;
// }

// export type ReceiveQueryResult = {
//   goodPageResult: GoodPageResult;
//   receiveData: ReceiveData;
// }

// export type GoodPageResult = PageResult<GoodPageVO[]>;

// /**
//  * 用于渲染领货单相关数据，以及提交领货时手动填写的数据
//  */

// export interface ReceiveData {
//   /**
//    * 订单号 
//    */
//   orderId?: number;
//   /**
//    * 任务分配日期
//    */
//   taskDate?: string | Date;
//   /**
//    * 送货分站
//    */
//   substation?: string;
//   /**
//    * 配送员
//    */
//   postman?: string;
//   /**
//    * 任务类型
//    */
//   taskType?: string;
//   /**
//    * 领货人
//    */
//   receiveName?: string;
//   /**
//    * 领货日期
//    */
//   receiveDate?: string | Date; 
// }
