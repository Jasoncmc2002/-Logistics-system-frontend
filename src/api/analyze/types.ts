export interface AnalyzeForm {
  number?: number;
  totalMoney?: number;
  totalTask?: number;
  stationName?: string;
}
export interface AnalyzeQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
}
export interface AnalyzePageVO {}
