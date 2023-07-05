export interface StationPageVO {
  id?: number;
  StationSum?: number;
}


export interface StationForm {
  id?:number;
  name?:string;
  address?:string;
  admin?:string;
  grade?:string;
  stationClass?:number;
  stationClassName?:string;
}


export interface StationQuery extends PageQuery {
  nameKeyword?: string;
  addrKeyword?: string;
  stationClass?:number;
  status?: number;
}

