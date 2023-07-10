/**
 * 文件API类型声明
 */
export interface FileInfo {
  name: string;
  url: string;
}
export interface BiResponse {
  chartId?: number;
  genChart?: string;
  genResult?: string;
}

export interface Chart {
  chartData?: string;
  chartName?: string;
  chartStatus?: string;
  chartType?: string;
  createTime?: string;
  execMessage?: string;
  genChart?: string;
  genResult?: string;
  goal?: string;
  id?: number;
  isDelete?: number;
  updateTime?: string;
  userId?: number;
}

export interface ChartAddRequest {
  chartData: string;
  chartType: string;
  goal: string;
  name: string;
}

export interface ChartEditRequest {
  chartData?: string;
  chartType?: string;
  goal?: string;
  id?: number;
  name?: string;
}

export interface ChartQueryRequest {
  chartType?: string;
  current?: number;
  goal?: string;
  id?: number;
  name?: string;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  userId?: number;
}
/*SDADA1*/
export interface ChartUpdateRequest {
  chartData?: string;
  chartType?: string;
  createTime?: string;
  genChart?: string;
  genResult?: string;
  goal?: string;
  id?: number;
  isDelete?: number;
  name?: string;
  updateTime?: string;
}

export interface DeleteRequest {
  id?: number;
}

export interface genChartByAiAsyncMqUsingPOSTParams {
  chartType?: string;
  goal?: string;
  name?: string;
}

export interface genChartByAiAsyncUsingPOSTParams {
  chartType?: string;
  goal?: string;
  name?: string;
}

export interface genChartByAiUsingPOSTParams {
  chartType: string;
  goal: string;
  name: string;
  creator: string;
}
