<script setup lang="ts">
/**
 * setup ： 语法糖，可以省去子组件在父组件的components中注册的过程，直接import之后就可以使用
 * lang="ts" ： 表示此文件是TypeScript格式
 */

/**
 * @see {@link https://vuejs.org/api/sfc-script-setup.html#defineoptions}
 */

/**
 * defineOptions : 语法糖，定义本文件name
 */


defineOptions({
	name: "User",
	inheritAttrs: false,
});


/**
 * 导入UI
 */

/**
 * 导入需要的user相关API
 */
import {
	getUserPage,
	getUserForm,
	deleteUsers,
	updateUser,
	updateUserStatus,
	updateUserPassword,
	downloadTemplateApi,
	exportUser,
	importUser,
} from "@/api/user";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
// new api
import { getOrderPage ,getGoodPage1, CancelOrderfunction, AddOrderGoodfunction, UnSubOrderGoodfunction,SalesExchangefunction, SalesReturnfunction} from "@/api/order";
import { getCustomerPage,getCustomerForm ,addCustomer} from "@/api/customer";


/**
 * 导入API所需要的数据类型
 */
import { UserForm, UserQuery, UserPageVO } from "@/api/user/types";

// new type

import { GoodQuery,GoodPageVO,GoodQuery1, OrderForm, OrderPageVO, OrderQuery,CancelOrder } from "@/api/order/types";
import { getGoodPage ,EditOrderfunction,getOrderPageByCondition} from "@/api/order";

import { CustomerQuery ,CustomerPageVO,CustomerForm} from "@/api/customer/types";

import{getFirstCategoryPage,getSecondaryCategoryPage,getFirstCategoryForm} from "@/api/good"

import {CentralStationQuery } from "@/api/good/types";

import {FirstCategoryForm,SecondaryCategoryForm } from "@/api/good/types";
/**
 * 定义ElementUI组件
 */

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单
const CustomerFormRef=ref(ElForm);
/**
 * ref本质也是reactive，ref(obj)等价于reactive({value: obj}) : 用于定义响应式变量
 * 定义所需变量
 * loading : 反馈是否数据加载完成
 * ids : 用来存储哪些数据被选中的
 * total : ?
 * dalog : ? 弹窗
 * queryParams : ?
 * userList : 对应用户表中的数据
 * formData : ?
 * rules : 用来规定表单中各个数据的要求
 * searchDept : ?
 * deptList : 存放dept
 * roleList ：存放role
 * importDialog : 导入用户时的弹窗
 * importDeptId : 导入选择的部门ID
 * excelFile : 用于存储一个Excel文件
 * excelFileList : 用于存储一堆Excel文件
 */
const loading = ref(false);
const ids = ref([]);

// new ids

const idsOrder = ref([]);

const total = ref(0);

// new total

const totalOrder = ref(0);
const totalGood= ref(0);
const totalGood1= ref(0);


const EditOrderdialog = reactive<DialogOption>({
	visible: false,
});

const AddGooddialog = reactive<DialogOption>({
	visible: false,
});
const UnSubdialog = reactive<DialogOption>({
	visible: false,
});

const SalesReturndialog = reactive<DialogOption>({
	visible: false,
});
const SalesExchangedialog = reactive<DialogOption>({
	visible: false,
});

const queryParams1 = reactive<CentralStationQuery>({
	pageNum: 1,
	pageSize: 10,
});
//全要查出来
const queryParams2 = reactive<CentralStationQuery>({
	pageNum: 1,
	pageSize: 1000,
});

// new queryParams

const queryParamsOrder = reactive<OrderQuery>({
	pageNum: 1,
	pageSize: 5,
	customerName:"",
	id:"",
	receiveName:"",
	startTime:"",
	endTime:"",
    orderType:""
});

const queryParamsOrderByCondition = reactive<OrderQuery>({
	pageNum: 1,
	pageSize: 5,
	customerName:"",
	id:"",
	receiveName:"",
	startTime:"",
	endTime:"",
    orderType:""
});

const queryParamsGood = reactive<GoodQuery>({
	pageNum: 1,
	pageSize: 5,
	keyId:null

});

const queryParamsGood1 = reactive<GoodQuery1>({
	pageNum: 1,
	pageSize: 5,
	goodClassId:"",
	goodSubclassId:"",
	keywords:""

});


const queryParamsCustomer = reactive<CustomerQuery>({

	pageNum: 1,
	pageSize: 5,
	name: "",
	idcard: "",
	mobilephone: "",

});

// new pagevo
const orderList = ref<OrderPageVO[]>();
const goodList = ref<GoodPageVO[]>();
var   goodList2 = ref<GoodPageVO[]>();
const goodList1 = ref<GoodPageVO[]>();
const formData = reactive<UserForm>({
	status: 1,
});
import type { CreatOrder,EditOrder } from "@/api/order/types";
const CreatOrderData=reactive<CreatOrder>({
	Orders:{
		goodSum:0,
	},
	Goods:[]
});
const EditOrderData=reactive<EditOrder>({
	id:0
       
})
const CancelOrderData=reactifyObject<CancelOrder>({

})

// new formData

const formDataOrder = reactive<OrderForm>({
});


//格式规则
const rules = reactive({
	name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
	idcard: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
	address: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
	roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
	work: [{ required: true, message: "工作单位不能为空", trigger: "blur" }],
	postcode: [{ required: true, message: "邮编不能为空", trigger: "blur" }],
	email: [
		{
			pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
			message: "请输入正确的邮箱地址",
			trigger: "blur",
		},
	],
	mobilephone: [
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
	addressephone: [
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
});


/**
 * 导入被选择的订单类型
 */
const OrderOptions = [
	{
		value: '新订',
		label: '新订',
	},
	{
		value: '退货',
		label: '退货',
	},
	{
		value: '换货',
		label: '换货',
	},

];
/**
 * 导入分站
 */
const SubstationOptions = [
	{
		value: '分站1',
		label: '分站1',
	},
	{
		value: '分站2',
		label: '分站2',
	},
	{
		value: '分站3',
		label: '分站3',
	},
	{
		value: '分站4',
		label: '分站4',
	},
	{
		value: '分站5',
		label: '分站5',
	},
];


var firstCategoryList=reactive<FirstCategoryForm>({});
var secondaryCategoryList=reactive<SecondaryCategoryForm>({});

import { ref } from 'vue'
import { number } from "echarts";
import { parseInt } from "lodash";

const active = ref(1);

const next = () => {
	if (active.value++ > 2) active.value = 1
};

const pre = () => {
	if (active.value-- < 2) active.value = 1
};

var  num1=0;





/**
 * watchEffect会监听所引用数据类型的所有属性（这里监听的是seachDeptName）
 * 满足filter中的value的内容会被保留，其它除去（返回一份新的数据，不影响原来数据）
 */


/**
 * 查询
 */
/**
 * 查询
 */

// new handleQuery

function handleQueryOrder() {
	loading.value = true;


	getOrderPageByCondition(queryParamsOrderByCondition)
		.then(({ data }) => {

			orderList.value = data.list;


			totalOrder.value = data.total;
		})
		.finally(() => {
			console.log("false");
			loading.value = false;
		});
}
// new handleQueryGood

function handleQueryGood() {
	loading.value = true;
	getGoodPage(queryParamsGood)
		.then(({ data }) => {

			goodList.value = data.list;


			totalGood.value = data.total;
		})
		.finally(() => {
			console.log("false");
			loading.value = false;
		});
}

function handleQueryGood1() {
	loading.value = true;
	getGoodPage1(queryParams1)
		.then(({ data }) => {

			goodList.value = data.list;


			totalGood.value = data.total;
		})
		.finally(() => {
			console.log("false");
			loading.value = false;
		});
}


//将选中商品添加到数组中
function AddtoGoodlist(row:any) {
	loading.value = true;
	queryParams1.goodClassId=row.goodClassId;
	queryParams1.goodSubclassId=row.goodSubclassId;
	queryParams1.keywords=row.goodName;
	getGoodPage1(queryParams1)

		.then(({data})=>{

			goodList.value=data.list;
			CreatOrderData.Orders.goodSum+=(goodList.value[0].goodPrice*num1);
			console.log(goodList.value[0].goodPrice);

			let a=goodList.value[0].goodPrice*goodList.value[0].goodNumber;
			console.log(a)

			CreatOrderData.Goods.push(
				{  goodPrice:goodList.value[0].goodPrice,
					goodClass:goodList.value[0].goodClassName,
					goodName:goodList.value[0].goodName,
					goodSubclass:goodList.value[0].goodSubClassName,
					goodCost:goodList.value[0].goodCost,
					goodFactory:goodList.value[0].goodFactory,
					goodId:goodList.value[0].id,
					keyId:CreatOrderData.Orders.customerId,
					goodNumber:num1,
					goodSale:goodList.value[0].goodSale,
					goodUnit:goodList.value[0].goodUnit,
					supply:goodList.value[0].supplyName,
					remark:goodList.value[0].remark,
					type:goodList.value[0].type,
					isReturn:goodList.value[0].isReturn,
					isChange:goodList.value[0].isChange,
					

				});


		}).finally(()=>{
		console.log("false");

		console.log(CreatOrderData);

		num1=0;
		loading.value = false;
	});
}

function AddtoUnSublist(row: { [key: string]: any },$index:any) {
	    
		//CreatOrderData.Orders.goodSum=0;
		CreatOrderData.Orders.goodSum+=(goodList1.value[($index)].goodPrice*row.changeNumber);
			
			CreatOrderData.Goods.push(
				{   id:goodList1.value[$index].id,
					goodPrice:goodList1.value[$index].goodPrice,
					goodClass:goodList1.value[$index].goodClass,
					goodName:goodList1.value[$index].goodName,
					goodSubclass:goodList1.value[$index].goodSubclass,
					goodCost:goodList1.value[$index].goodCost,
					goodFactory:goodList1.value[$index].goodFactory,
					goodId:goodList1.value[$index].goodId,
					keyId:CreatOrderData.Orders.customerId,
					goodNumber:goodList1.value[$index].goodNumber,
					changeNumber:row.changeNumber,
					goodSale:goodList1.value[$index].goodSale,
					goodUnit:goodList1.value[$index].goodUnit,
					supply:goodList1.value[$index].supplyName,
					remark:goodList1.value[$index].remark,
					type:goodList1.value[$index].type,
					isReturn:goodList1.value[$index].isReturn,
					isChange:goodList1.value[$index].isChange,
					
					
				});
				console.log(CreatOrderData);	
			
					

	}



function handleQuerySecondaryCategory() {
	loading.value = true;
	getSecondaryCategoryPage(queryParams2)
		.then(({ data }) => {
			secondaryCategoryList.value = data.list;
		})
		.finally(() => {
			loading.value = false;
		});
}

function handleQueryFirstCategory() {
	loading.value = true;
	getFirstCategoryPage(queryParams2)
		.then(({ data }) => {
			firstCategoryList.value = data.list;
		})
		.finally(() => {
			loading.value = false;
		});
}



/**
 * 重置查询
 */
function resetQuery() {
	CustomerFormRef.value.resetFields();
	queryParamsCustomer
	queryParamsCustomer.pageNum = 1;
	queryParamsCustomer.name= "";
	queryParamsCustomer.idcard = "";
	queryParamsCustomer.mobilephone = "";


	//handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
	ids.value = selection.map((item: any) => item.id);
}

// new selection

function handleSelectionChangeOrder(selection: any) {
	idsOrder.value = selection.map((item: any) => item.id);
}

/**
 * 显示订单商品信息
 */

function displayOrderInfo(row: { [key: string]: any }) {
	queryParamsGood.keyId=row.id;
	handleQueryGood()
	//getGoodPage(queryParamsGood);


}


/**
 * 打开订单创建弹窗
 */
function openEditOrderdialog(row: { [key: string]: any }) {

	

	EditOrderdialog.title = "编辑订单信息";
	EditOrderData.id=row.id;
    EditOrderData.customerAddress=row.customerAddress;
	EditOrderData.deliveryDate=row.deliveryDate;
	EditOrderData.explain=row.explain;
	EditOrderData.isInvoice=row.isInvoice;
	EditOrderData.mobilephone=row.mobilephone;
	EditOrderData.orderType=row.orderType;
	EditOrderData.postcode=row.postcode;
	EditOrderData.receiveName=row.receiveName;
	EditOrderData.substation=row.substation;
	EditOrderdialog.visible = true;


}

function openAddGooddialog(row: { [key: string]: any }) {

	
    AddGooddialog.title = "增加下单商品";

    AddGooddialog.visible = true;
	                  
          {
			
			CreatOrderData.Orders.id=row.id;
			CreatOrderData.Orders.creater=row.creater;
			CreatOrderData.Orders.goodSum=row.goodSum;
			CreatOrderData.Orders.explain=row.explain;
			CreatOrderData.Orders.orderDate=row.orderDate;
			CreatOrderData.Orders.deliveryDate=row.deliveryDate;
			CreatOrderData.Orders.orderStatus=row.orderStatus;
			CreatOrderData.Orders.customerAddress=row.customerAddress;
			CreatOrderData.Orders.customerId=row.customerId;
			CreatOrderData.Orders.customerName=row.customerName;
			CreatOrderData.Orders.receiveName=row.receiveName;
			CreatOrderData.Orders.mobilephone=row.mobilephone;
			CreatOrderData.Orders.postcode=row.postcode;
			CreatOrderData.Orders.isInvoice=row.isInvoice;
			CreatOrderData.Orders.orderType=row.orderType;
			CreatOrderData.Orders.substation=row.substation;
			}
			loading.value = false;
		
}

function openUnSubdialog(row: { [key: string]: any }) {

	UnSubdialog.title = "退订商品";
	UnSubdialog.visible = true;			  
	  
		CreatOrderData.Orders.id=row.id;
		CreatOrderData.Orders.orNumber=row.id;
		CreatOrderData.Orders.creater=row.creater;
		CreatOrderData.Orders.goodSum=0;
		CreatOrderData.Orders.explain=row.explain;
		CreatOrderData.Orders.orderDate=row.orderDate;
		CreatOrderData.Orders.deliveryDate=row.deliveryDate;
		CreatOrderData.Orders.orderStatus=row.orderStatus;
		CreatOrderData.Orders.customerAddress=row.customerAddress;
		CreatOrderData.Orders.customerId=row.customerId;
		CreatOrderData.Orders.customerName=row.customerName;
		CreatOrderData.Orders.receiveName=row.receiveName;
		CreatOrderData.Orders.mobilephone=row.mobilephone;
		CreatOrderData.Orders.postcode=row.postcode;
		CreatOrderData.Orders.isInvoice=row.isInvoice;
		CreatOrderData.Orders.orderType="退订";
		CreatOrderData.Orders.substation=row.substation;

		queryParamsGood.keyId=row.id;
		getGoodPage(queryParamsGood)
		.then(({ data }) => {
			goodList1.value=data.list		
		})
		.finally(() => {
			loading.value = false;
		});

		}
function openSalesReturndialog(row: { [key: string]: any }) {

	SalesReturndialog.title = "退货";
	SalesReturndialog.visible = true;			  
  
	CreatOrderData.Orders.id=row.id;
	CreatOrderData.Orders.orNumber=row.id;
	CreatOrderData.Orders.creater=row.creater;
	CreatOrderData.Orders.goodSum=0;
	CreatOrderData.Orders.explain=row.explain;
	CreatOrderData.Orders.orderDate=row.orderDate;
	CreatOrderData.Orders.deliveryDate=row.deliveryDate;
	CreatOrderData.Orders.orderStatus=row.orderStatus;
	CreatOrderData.Orders.customerAddress=row.customerAddress;
	CreatOrderData.Orders.customerId=row.customerId;
	CreatOrderData.Orders.customerName=row.customerName;
	CreatOrderData.Orders.receiveName=row.receiveName;
	CreatOrderData.Orders.mobilephone=row.mobilephone;
	CreatOrderData.Orders.postcode=row.postcode;
	CreatOrderData.Orders.isInvoice=row.isInvoice;
	CreatOrderData.Orders.orderType="退货";
	CreatOrderData.Orders.substation=row.substation;

	queryParamsGood.keyId=row.id;
	getGoodPage(queryParamsGood)
	.then(({ data }) => {
		goodList1.value=data.list		
	})
	.finally(() => {
		loading.value = false;
	});

	}	
function openSalesExchangedialog(row: { [key: string]: any }) {

		SalesExchangedialog.title = "换货";
		SalesExchangedialog.visible = true;			  

			CreatOrderData.Orders.id=row.id;
			CreatOrderData.Orders.orNumber=row.id;
			CreatOrderData.Orders.creater=row.creater;
			CreatOrderData.Orders.goodSum=0;
			CreatOrderData.Orders.explain=row.explain;
			CreatOrderData.Orders.orderDate=row.orderDate;
			CreatOrderData.Orders.deliveryDate=row.deliveryDate;
			CreatOrderData.Orders.orderStatus=row.orderStatus;
			CreatOrderData.Orders.customerAddress=row.customerAddress;
			CreatOrderData.Orders.customerId=row.customerId;
			CreatOrderData.Orders.customerName=row.customerName;
			CreatOrderData.Orders.receiveName=row.receiveName;
			CreatOrderData.Orders.mobilephone=row.mobilephone;
			CreatOrderData.Orders.postcode=row.postcode;
			CreatOrderData.Orders.isInvoice=row.isInvoice;
			CreatOrderData.Orders.orderType="换货";
			CreatOrderData.Orders.substation=row.substation;

			queryParamsGood.keyId=row.id;
			getGoodPage(queryParamsGood)
			.then(({ data }) => {
				goodList1.value=data.list		
			})
			.finally(() => {
				loading.value = false;
			});

			}	

function EditOrder(){
	{
		loading.value = true;
		EditOrderfunction(EditOrderData)
			.then(() => {
				ElMessage.success("编辑订单信息成功");
				closeEditOrderdialog();

				
			})
			.finally(() => (loading.value = false));
	}
}



function handleCancel(row: { [key: string]: any }){

	{   CancelOrderData.id=row.id;
		CancelOrderData.orderStatus="已撤销";


		loading.value = true;
		CancelOrderfunction(CancelOrderData)
			.then(() => {
				ElMessage.success("撤销订单成功");
				

				
			})
			.finally(() => (loading.value = false));
	}
}

function handleAddOrderGood(){
	{   
		loading.value = true;
		AddOrderGoodfunction(CreatOrderData)
			.then(() => {


				ElMessage.success("新增下单成功");
				closeAddGooddialog();

				
			})
			.finally(() => (loading.value = false));
	}
}

function handleUnSubOrderGood(){
	{   
		loading.value = true;
		UnSubOrderGoodfunction(CreatOrderData)
			.then(() => {


				ElMessage.success("退订商品成功");
				closeUnSubdialog();
                resetCreatOrderData();
				
			})
			.finally(() => (
				
			loading.value = false));
	}
}

function handleSalesReturn(){
	{   
		loading.value = true;
		SalesReturnfunction(CreatOrderData)
			.then(() => {


				ElMessage.success("订单退货成功");
				closeSalesReturndialog();
                resetCreatOrderData();
				
			})
			.finally(() => (
				
			loading.value = false));
	}
}
function handleSalesExchange(){
	{   
		loading.value = true;
		SalesExchangefunction(CreatOrderData)
			.then(() => {


				ElMessage.success("换货申请成功");
				closeSalesReturndialog();
                resetCreatOrderData();
				
			})
			.finally(() => (
				
			loading.value = false));
	}
}
/**
 * 关闭编辑订单信息弹窗
 */
function closeEditOrderdialog() {
	EditOrderdialog.visible = false;
	handleQueryOrder();
	resetEditOrderData();
}
/**
 * 关闭添加订单商品弹窗
 */
function closeAddGooddialog() {
	AddGooddialog.visible = false;
	//handleQueryOrder();
	resetCreatOrderData();
}
/**
 * 关闭退订弹窗
 */
function closeUnSubdialog() {
	UnSubdialog.visible = false;
	
	resetCreatOrderData();
}
function closeSalesReturndialog() {
	SalesReturndialog.visible = false;
	
	resetCreatOrderData();
}
function closeSalesExchangedialog() {
	SalesExchangedialog.visible = false;
	
	resetCreatOrderData();
}


function resetCreatOrderData() {
	CreatOrderData.Orders={
		goodSum:0
	},
		CreatOrderData.Goods=[]


}
function resetEditOrderData() {
	EditOrderData.id=0;

}


onMounted(() => {

	
	handleQuerySecondaryCategory();
	handleQueryFirstCategory();
});


</script>

<template>
	<div class="app-container">


		<!-- 搜索栏 -->

		<div class="search-container">
			<el-form ref="CustomerFormRef" :model="queryParamsOrderByCondition" :inline="true">


				<el-row gutter="5">
					<el-col span="6">
						<el-form-item label="订单搜索" prop="keywords">
							<el-input
									v-model.number="queryParamsOrderByCondition.id"
									placeholder="填写订单编号"
									clearable
									type="number"
									style="width: 200px"
									@keyup.enter="handleQueryOrder"
							/>
						</el-form-item>
					</el-col>

					<el-col span="9">
						<el-form-item  lable="查询日期" prop="keywords">
							<el-date-picker
									v-model="queryParamsOrderByCondition.startTime"
									type="datetime"
									placeholder="查询日期:起始日期"
							/>
						</el-form-item>
					</el-col>
					<el-col span="9">

						<el-form-item >
							<el-date-picker
									v-model="queryParamsOrderByCondition.endTime"
									type="datetime"
									placeholder="截至日期"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row gutter="5">
					<el-col span="6">
						<el-form-item  prop="keywords" label="客户姓名">
							<el-input
									v-model="queryParamsOrderByCondition.customerName"
									placeholder="填写客户姓名"
									clearable
									style="width: 200px"
									@keyup.enter="handleQueryOrder"
							/>

						</el-form-item>
					</el-col>
					<el-col span="6">
						<el-form-item  prop="keywords" label="接收人">
							<el-input
									v-model="queryParamsOrderByCondition.receiveName"
									placeholder="填写接收人姓名"
									clearable
									style="width: 200px"
									@keyup.enter="handleQueryOrder"
							/>

						</el-form-item>
					</el-col>
					<el-col span="6">

						<el-form-item>
							<el-button type="primary" @click="handleQueryOrder"
							><i-ep-search />搜索</el-button
							>
							<el-button @click="resetQuery">
								<i-ep-refresh />
								重置</el-button
							>

						</el-form-item>
					</el-col>


				</el-row>

			</el-form>

		</div>

		<el-card shadow="never">

			<el-container>

				<el-header>订单信息</el-header>
				<el-main>
					<el-table
							v-loading="loading"
							:data="orderList"
							@selection-change="handleSelectionChangeOrder"

					>

						<!-- 订单信息具体数据 -->
						<el-table-column
								key="id"
								label="订单编号"
								align="center"
								prop="id"
								width="80"
						/>

						<el-table-column

								label="创建者"
								align="center"
								prop="creater"
						/>
						<el-table-column
								label="商品总额"
								width="100"
								align="center"
								prop="goodSum"
						/>
						
						<el-table-column
								label="备注信息"
								align="center"
								prop="explain"
								width="100"
						/>
						<el-table-column
								label="订单日期"
								align="center"
								prop="orderDate"
								width="100"
						/>
						<el-table-column
								label="送货日期"
								align="center"
								prop="deliveryDate"
								width="100"
						/>

						<el-table-column
								label="订单状态"
								align="center"
								prop="orderStatus"
								width="100"
						/>
						<el-table-column
								label="送货地址"
								align="center"
								prop="customerAddress"
								width="100"
						/>
						<el-table-column
								label="客户id"
								align="center"
								prop="customerId"
								width="80"
						/>
						<el-table-column
								label="客户姓名"
								align="center"
								prop="customerName"
								width="100"
						/>
						<el-table-column
								label="接收人"
								align="center"
								prop="receiveName"
								width="100"
						/>
						<el-table-column
								label="电话"
								align="center"
								prop="mobilephone"
								width="100"
						/>v <el-table-column
							label="邮编"
							align="center"
							prop="postcode"
							width="100"
					/>
						<el-table-column
								label="是否用发票"
								align="center"
								prop="isInvoice"
								width="100"
						/>
						<el-table-column
								label="订单类型"
								align="center"
								prop="orderType"
								width="80"
						/>
						<el-table-column
								label="分站"
								align="center"
								prop="substation"
								width="100"
						/>
						

						<!-- 一些操作按钮 -->
						<el-table-column label="操作" fixed="right" width="280">
							<template #default="scope">
								<el-button
									type="primary"
									size="small"
									link
									@click="displayOrderInfo(scope.row)"
							        ><i-ep-paperclip/>详细信息</el-button>

								<el-button
									v-if="scope.row.orderStatus=='可分配'||scope.row.orderStatus=='缺货'" 
									type="primary"
									link
									size="small"
									@click="openEditOrderdialog(scope.row)"
									><i-ep-edit />编辑订单</el-button
									>
									<el-button
									type="primary"
									link
									size="small"
									@click="handleCancel(scope.row)"
									><i-ep-delete />撤销订单</el-button>
									
									<el-button
									v-if="scope.row.orderStatus=='可分配'||scope.row.orderStatus=='缺货'"
									type="primary"
									link
									size="small"
									@click="openAddGooddialog(scope.row)"
									><i-ep-plus />新增下单</el-button>

									
									<el-button
									v-if="scope.row.orderStatus=='可分配'||scope.row.orderStatus=='缺货'"
									type="primary"
									link
									size="small"
									@click="openUnSubdialog(scope.row)"
									><i-ep-minus />退订</el-button>
									<el-button
									v-if="scope.row.orderStatus=='可分配'||scope.row.orderStatus=='缺货'"
									type="primary"
									link
									size="small"
									@click="openSalesReturndialog(scope.row)"
									><i-ep-refresh />退货</el-button>
									
									<el-button
									v-if="scope.row.orderStatus=='可分配'||scope.row.orderStatus=='缺货'"
									type="primary"
									link
									size="small"
									@click="openSalesExchangedialog(scope.row)"
									><i-ep-refresh />换货</el-button>

							</template>
						</el-table-column>
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsOrder.pageNum"
							v-model:limit="queryParamsOrder.pageSize"
							@pagination="handleQueryOrder"
					/></el-main>
			</el-container>

		</el-card>

		
		<el-container>
			<el-card>
				<el-header>商品详情</el-header>
				<el-main>

					<!--good表单开始-->
					<el-table
							v-loading="loading"
							:data="goodList"
							@selection-change="handleSelectionChangeOrder"
					>
						<!-- 选中框行 -->
						<!-- <el-table-column type="selection" width="50" align="center" /> -->

						<!-- 具体数据 -->
						<el-table-column
								label="订单号"
								align="center"
								prop="keyId"
								width="140"

						/>
						<el-table-column
								key="id"
								label="商品编号"
								align="center"
								prop="id"
								width="150"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="150"
						/>
						<el-table-column
								label="商品子类"
								width="150"
								align="center"
								prop="goodSubclass"

						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>
						<el-table-column
								label="商品数量"
								align="center"
								prop="goodNumber"
								width="140"

						/>
						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"

						/>
						
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood.pageNum"
							v-model:limit="queryParamsGood.pageSize"
							@pagination="handleQueryGood"
					/>
				</el-main>
			</el-card>

		</el-container>

		<!-- 表单结束位置 -->


		<!-- 编辑订单信息弹窗-edit-order -->
		<el-dialog
				v-model="EditOrderdialog.visible"
				:title="EditOrderdialog.title"
				width="1100px"
				append-to-body
				@close="closeEditOrderdialog"
		>


			<!--记得写rules-->

			

			<div
					:model="EditOrderData">

					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>填写送货信息</span>
								<el-button class="button" text></el-button>
							</div>
						</template>
						<!--row3-->

						<el-row>
							<el-col span="12">
								<el-form-item label="接收人姓名" prop="receiveName">
									<el-input v-model="EditOrderData.receiveName" />
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="接收人电话" prop="mobilephone">
									<el-input v-model="EditOrderData.mobilephone" />
								</el-form-item>
							</el-col>

						</el-row>

						<!--row4-->

						<el-row>
							<el-col span="8">
								<el-form-item label="订单类型" prop="order_type">
									<el-select
											v-model="EditOrderData.orderType"
											class="m-2"
											placeholder="订单类型"
									>
										<el-option
												v-for="item in OrderOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col span="8">
								<el-form-item label="投递分站" prop="substation">
									<el-select
											v-model="EditOrderData.substation"
											class="m-2"
											placeholder="选择分站"
									>
										<el-option
												v-for="item in SubstationOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="要求完成日期" prop="delivery_date">
									<el-date-picker
											v-model="EditOrderData.deliveryDate"
											type="datetime"
											placeholder="Select date and time"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!--row 5-->

						<el-row>
							<el-col span="8">
								<el-form-item label="是否索要发票" >
									<el-radio-group
											v-model="EditOrderData.isInvoice"
											class="ml-4"
									>
										<el-radio label="1" size="large">是</el-radio>
										<el-radio label="0" size="large">否</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>

							<el-col span="8">
								<el-form-item label="送货地址" >
									<el-input style="" v-model="EditOrderData.customerAddress"/>
								</el-form-item>
							</el-col>

							<el-col span="8">
								<el-form-item label="收件人邮编" >
									<el-input v-model="EditOrderData.postcode" />
								</el-form-item>
							</el-col>
						</el-row>

						<!--row 6-->
						<el-row>
							<el-col span="12">
								<el-form-item label="备注信息" prop="explain">
									<el-input v-model="EditOrderData.explain" />
								</el-form-item>
							</el-col>
						</el-row>



					</el-card>
				


				<!--下一步-->

				

			</div>



			<template #footer>
				<div class="dialog-footer">
					<el-row >

						<!-- <el-button v-if="active < 2" style="margin-top: 12px" @click="next"
						>下一步</el-button
						>
						<el-button v-if="active > 1" style="margin-top: 12px" @click="pre"
						>上一步</el-button
						> -->
						
						<el-button style="margin-top: 12px" @click="closeEditOrderdialog">取 消</el-button>


						<el-button type="primary"    style="margin-top: 12px;"  @click="EditOrder()">确认修改</el-button>


					</el-row>
				</div>
			</template>
		</el-dialog>
<!--增加订单商品弹窗-->
		<el-dialog
				v-model="AddGooddialog.visible"
				:title="AddGooddialog.title"
				width="1100px"
				append-to-body
				@close="closeAddGooddialog"
		>
	
	
		<el-form ref="CustomerFormRef" :model="queryParams1" :inline="true">
						<el-form-item label="商品搜索" prop="keywords">
							<el-select v-model="queryParams1.goodClassId" class="m-2" placeholder="一级分类" >
								<el-option
										v-for="item in firstCategoryList.value"
										:key="item.id"
										:label="item.fname"
										:value="item.id"/>
							</el-select>

							<el-select v-model="queryParams1.goodSubclassId" class="m-2" placeholder="二级分类" >
								<el-option
										v-for="item in secondaryCategoryList.value"
										:key="item.id"
										:label="item.sname"
										:value="item.id"/>
							</el-select>

							<el-input
									v-model="queryParams1.keywords"
									placeholder="商品名"
									clearable
									style="width: 200px"
									@keyup.enter="handleQueryGood1"
							/>

							<el-button type="primary" @click="handleQueryGood1"
							><i-ep-search />搜索</el-button
							>
						</el-form-item>

					</el-form>

					<el-table
							v-loading="loading"
							:data="goodList"
							@selection-change="handleSelectionChangeOrder"
					>
	

						<!-- 具体数据 -->

						 <el-table-column
								key="id"
								label="编号"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClassId"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclassId"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>

						<el-table-column
								label="商品数量"
								align="center"
								prop="goodNumber"
								width="150"

						><el-input-number id="sum" v-model="num1" size="small" :min="0" :max="10" clearable label="描述文字"></el-input-number></el-table-column>



						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"


						/>

						<el-table-column label="操作" fixed="right" width="150">
							<template #default="scope">

								<el-button type="primary" @click="AddtoGoodlist(scope.row)"
								>添加</el-button>

							</template>

						</el-table-column>



					</el-table> 

					 <pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 

					 <el-form ref="CustomerFormRef" inline="true" >
						<el-form-item label="新增后订单商品总额是" props="goodSum" >
							<el-input
									v-model="CreatOrderData.Orders.goodSum"
									readonly="readonly"
									style=""
							>

							</el-input>
						</el-form-item>
					</el-form> 




					<el-table
							v-loading="loading"
							:data="CreatOrderData.Goods"
							@selection-change="handleSelectionChangeOrder">

						<el-table-column
								key="id"
								label="编号"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>
						<el-table-column
								label="商品数量"
								align="center"
								prop="goodNumber"
								width="100"

						/>
						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"

						/>
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 
					<template #footer>
				<div class="dialog-footer">
					<el-row >

						
			<el-button style="margin-top: 12px" @click="closeAddGooddialog">取 消</el-button>


	<el-button type="primary"  style="margin-top: 12px;"  @click="handleAddOrderGood()">新增下单</el-button>


					</el-row>
				</div>
			</template>
	
	</el-dialog>

<!--退订弹窗-->

	<el-dialog
				v-model="UnSubdialog.visible"
				:title="UnSubdialog.title"
				width="1100px"
				append-to-body
				@close="closeUnSubdialog"
		>
	
					<el-table
							v-loading="loading"
							:data="goodList1"
							@selection-change="handleSelectionChangeOrder"
					>
	

						<!-- 具体数据 -->
						
				
						 <el-table-column
								key="id"
								label="商品id"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="100"

						/>

						<el-table-column
								label="退订数量"
								align="center"
								prop="goodNumber"
								width="150"

						>
						<template #default="scope">
							<el-input-number 
							id="sum" 
							v-model="scope.row.changeNumber" 
							size="small" 
							:min="0" 
							:max="scope.row.goodNumber" 
							clearable 
							label="描述文字">
							</el-input-number>
							</template>
						
						</el-table-column>


						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="100"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="100"


						/>

						<el-table-column label="操作" fixed="right" width="150">
							<template #default="scope">

								<el-button type="primary" @click="AddtoUnSublist(scope.row,scope.$index)"
								>确定退订数量</el-button>

							</template>

						</el-table-column>



					</el-table> 

					 <pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 

					 <el-form ref="CustomerFormRef" inline="true" >
						<el-form-item label="退订的订单商品总额是" props="goodSum" >
							<el-input
									v-model="CreatOrderData.Orders.goodSum"
									readonly="readonly"
									style=""
							>

							</el-input>
						</el-form-item>
					</el-form> 




					<el-table
							v-loading="loading"
							:data="CreatOrderData.Goods"
							@selection-change="handleSelectionChangeOrder">
				
						<el-table-column
								key="id"
								label="编号"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>
						<el-table-column
								label="退订商品数量"
								align="center"
								prop="changeNumber"
								width="100"

						/>
						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"

						/>
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 
					<template #footer>
				<div class="dialog-footer">
					<el-row >

						
			<el-button style="margin-top: 12px" @click="closeUnSubdialog">取 消</el-button>


	<el-button type="primary"  style="margin-top: 12px;"  @click="handleUnSubOrderGood()">确认退订</el-button>


					</el-row>
				</div>
			</template>
	
	</el-dialog>

	<!--退货弹窗-->
	<el-dialog
				v-model="SalesReturndialog.visible"
				:title="SalesReturndialog.title"
				width="1100px"
				append-to-body
				@close="closeSalesReturndialog"
		>
	
					<el-table
							v-loading="loading"
							:data="goodList1"
							@selection-change="handleSelectionChangeOrder">
	
						 <el-table-column
								key="id"
								label="商品id"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="100"

						/>

						<el-table-column
								label="退货数量"
								align="center"
								prop="goodNumber"
								width="150"

						>
						<template #default="scope">
							<el-input-number 
							id="sum" 
							v-model="scope.row.changeNumber" 
							size="small" 
							:min="0" 
							:max="scope.row.goodNumber" 
							clearable 
							label="描述文字">
							</el-input-number>
							</template>
						
						</el-table-column>


						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="100"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="100"


						/>

						<el-table-column label="操作" fixed="right" width="150">
							<template #default="scope">

								<el-button type="primary" @click="AddtoUnSublist(scope.row,scope.$index)"
								>确定退货数量</el-button>

							</template>

						</el-table-column>



					</el-table> 

					 <pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 

					
					<el-table
							v-loading="loading"
							:data="CreatOrderData.Goods"
							@selection-change="handleSelectionChangeOrder">
				
						<el-table-column
								key="id"
								label="编号"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>
						<el-table-column
								label="退货商品数量"
								align="center"
								prop="changeNumber"
								width="100"

						/>
						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"

						/>
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 
					<template #footer>
				<div class="dialog-footer">
					<el-row >

						
			<el-button style="margin-top: 12px" @click="closeSalesReturndialog">取 消</el-button>


	<el-button type="primary"  style="margin-top: 12px;"  @click="handleSalesReturn()">确认退货</el-button>


					</el-row>
				</div>
			</template>
	
	</el-dialog>
    <!--换货弹窗-->
	<el-dialog
				v-model="SalesExchangedialog.visible"
				:title="SalesExchangedialog.title"
				width="1100px"
				append-to-body
				@close="closeSalesExchangedialog"
		>
	
					<el-table
							v-loading="loading"
							:data="goodList1"
							@selection-change="handleSelectionChangeOrder">
	
						 <el-table-column
								key="id"
								label="商品id"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="100"

						/>

						<el-table-column
								label="换货数量"
								align="center"
								prop="goodNumber"
								width="150"

						>
						<template #default="scope">
							<el-input-number 
							id="sum" 
							v-model="scope.row.changeNumber" 
							size="small" 
							:min="0" 
							:max="scope.row.goodNumber" 
							clearable 
							label="描述文字">
							</el-input-number>
							</template>
						
						</el-table-column>


						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="100"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="100"


						/>

						<el-table-column label="操作" fixed="right" width="150">
							<template #default="scope">

								<el-button type="primary" @click="AddtoUnSublist(scope.row,scope.$index)"
								>确定换货数量</el-button>

							</template>

						</el-table-column>



					</el-table> 

					 <pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 

					
					<el-table
							v-loading="loading"
							:data="CreatOrderData.Goods"
							@selection-change="handleSelectionChangeOrder">
				
						<el-table-column
								key="id"
								label="编号"
								align="center"
								prop="id"
								width="100"
						/>
						<el-table-column

								label="商品类"
								align="center"
								prop="goodClass"
								width="100"
						/>
						<el-table-column
								label="商品子类"
								width="100"
								align="center"
								prop="goodSubclass"
						/>
						<el-table-column
								label="商品名"
								align="center"
								prop="goodName"
								width="150"

						/>
						<el-table-column
								label="换货商品数量"
								align="center"
								prop="changeNumber"
								width="100"

						/>
						<el-table-column
								label="商品价格"
								align="center"
								prop="goodPrice"
								width="140"

						/>
						<el-table-column
								label="商品备注"
								align="center"
								prop="remark"
								width="140"

						/>
					</el-table>
					<pagination
							v-if="total > 0"
							v-model:total="total"
							v-model:page="queryParamsGood1.pageNum"
							v-model:limit="queryParamsGood1.pageSize"
							@pagination="handleQueryGood"
					/> 
					<template #footer>
				<div class="dialog-footer">
					<el-row >

						
			<el-button style="margin-top: 12px" @click="closeSalesExchangedialog()">取 消</el-button>


	<el-button type="primary"  style="margin-top: 12px;"  @click="handleSalesExchange()">确认换货</el-button>


					</el-row>
				</div>
			</template>
	
	</el-dialog>
	</div>
</template>
<style>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}

.item {
	margin-bottom: 14px;
}

.box-card {
	width: 1000px;
}
</style>
