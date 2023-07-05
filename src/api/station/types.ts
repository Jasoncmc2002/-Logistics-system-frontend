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

export interface StationInOutPageVO {
	id?: number;
	StationInOutSum?: number;
}


export interface StationInOutForm {
	id?:number;
	stationClass?:number;
	// stationClassName?:string;
	alloId?:number;
	stationId?:number;
	stationName?:string;
    taskId?:number;
    goodId?:number;
    goodName?:string;
    goodPrice?:number;
    goodUnit?:string;
    goodFactory?:string;
    number?:number;
    date?:string;
	remark?:string;
	type?:string;
}


export interface StationInOutQuery extends PageQuery {
	stationKeyword?: number;
	goodKeyword?: string;
	typeKeyword?:string;
	startTime?:string;
	endTime?:string;
	status?: number;
}

