
export interface CustomerForm {
    id?: number;
    addressphone?: string;
    work?: string;
    address?: string;
    is_deleted?: string;
    idcard?: string;
    mobilephone?: string;
    name?: string;
    postcode?: string;
    email?: string;
	  userId?: number;
}

export interface CentralStationForm {
	id?: number;
	goodClassId?: number;
	goodClassName?: string;
	goodSubclassId?: number;
	goodSubClassName?: string;
	goodName?: string;
	stock?: number;
	withdrawal?: number;
	waitAllo?: number;
	doneAllo?: number;
	warn?: number;
	max?: number;
	goodPrice?: number;
	goodSale?: number;
	goodCost?: number;
	goodUnit?: string;
	supplyId?: number;
	supplyName?: number;
	sellDate?: number;
	isReturn?: number;
	isReturnName?: string;
	isChange?: number;
	isChangeName?: string;
	remark?: string;
	stationId?: number;
	stationName?: string;
	vacancy?: number;
	goodFactory?: string;
}
