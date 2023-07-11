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
import { UploadFile } from "element-plus";

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
import { getOrderPage ,getGoodPage1} from "@/api/order";
import { getCustomerPage,getCustomerForm ,addCustomer} from "@/api/customer";


/**
 * 导入API所需要的数据类型
 */
import { UserForm, UserQuery, UserPageVO } from "@/api/user/types";

// new type

import { GoodQuery,GoodPageVO,GoodForm,GoodQuery1, OrderForm, OrderPageVO, OrderQuery } from "@/api/order/types";
import { getGoodPage ,CreatOrderfunction,getOrderPageByCondition} from "@/api/order";

import { CustomerQuery ,CustomerPageVO,CustomerForm} from "@/api/customer/types";

import{getFirstCategoryPage,getSecondaryCategoryForm,getSecondaryCategoryPage,getFirstCategoryForm} from "@/api/good"

import {CentralStationPageVO,CentralStationForm,CentralStationQuery } from "@/api/good/types";

import {FirstCategoryPageVO,FirstCategoryForm,FirstCategoryQuery,SecondaryCategoryForm,SecondaryCategoryPageVO,SecondaryCategoryQuery } from "@/api/good/types";
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

const dialog = reactive<DialogOption>({
	visible: false,
});

const CreateOrderdialog = reactive<DialogOption>({
	visible: false,
});

const queryParams = reactive<UserQuery>({
	pageNum: 1,
	pageSize: 10,
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
});

const queryParamsOrderByCondition = reactive<OrderQuery>({
	pageNum: 1,
	pageSize: 5,
	id: undefined,
	customerName:"",

	receiveName:"",
	startTime:"",
	endTime:""
});

const queryParamsGood = reactive<GoodQuery>({
	pageNum: 1,
	pageSize: 5,

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

const userList = ref<UserPageVO[]>();
const customerList=ref<CustomerPageVO[]>();

// new pagevo
const orderList = ref<OrderPageVO[]>();
const goodList = ref<GoodPageVO[]>();
const goodList1 = ref<GoodPageVO[]>();
const formData = reactive<UserForm>({
	status: 1,
});
import type { CreatOrder } from "@/api/order/types";
const CreatOrderData=reactive<CreatOrder>({
	Orders:{
		goodSum:0,
	},
	Goods:[]
});

// new formData

const formDataOrder = reactive<OrderForm>({
});

const formDataCustomer=reactive<CustomerForm>({

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

const searchDeptName = ref();
const deptList = ref<OptionType[]>();
const roleList = ref<OptionType[]>();

const importDialog = reactive<DialogOption>({
	title: "用户导入",
	visible: false,
});

/**
 * 导入选择的部门ID
 */
const importDeptId = ref<number>();
const excelFile = ref<File>();
const excelFilelist = ref<File[]>([]);
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
function handleQuery() {
	loading.value = true;
	getUserPage(queryParams)
		.then(({ data }) => {
			userList.value = data.list;

			console.log(userList);
			total.value = data.total;
		})
		.finally(() => {
			loading.value = false;
		});
}
/**
 * 查询
 */
function handleQueryCustomer() {
	loading.value = true;
	getCustomerPage(queryParamsCustomer)
		.then(({ data }) => {
			customerList.value = data.list;
			console.log(customerList);
			total.value = data.total;
		})
		.finally(() => {
			loading.value = false;
		});
}

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
function computeGoodSum( ){
	return{

	}


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

					keyId:CreatOrderData.Orders.customerId,
					goodNumber:num1,
					goodSale:goodList.value[0].goodSale,
					goodUnit:goodList.value[0].goodUnit,
					supply:goodList.value[0].supplyName,
					remark:goodList.value[0].remark,
					type:goodList.value[0].type,
					isReturn:goodList.value[0].isReturn,
					isChange:goodList.value[0].isChange,
					//username:goodList.value[0].username,

				});


		}).finally(()=>{
		console.log("false");

		console.log(CreatOrderData);

		num1=0;
		loading.value = false;
	});
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
 * 打开用户弹窗
 */
async function openDialog(userId?: number) {

	dialog.visible = true;
	formDataCustomer.address="";
	formDataCustomer.addressphone="";
	formDataCustomer.email="";
	formDataCustomer.idcard="";
	formDataCustomer.is_deleted="";
	formDataCustomer.mobilephone="";
	formDataCustomer.name="";
	formDataCustomer.postcode="";
	formDataCustomer.work="";
}

/**
 * 打开订单创建弹窗
 */
function openCreateOrderDialog(row: { [key: string]: any }) {

	CreateOrderdialog.visible = true;
	CreateOrderdialog.title = "创建订单";
	queryParamsCustomer.idcard=row.idcard;
	queryParamsCustomer.name=row.name;
	queryParamsCustomer.mobilephone=row.mobilephone;
	CreatOrderData.Orders.customerId=row.id;
	CreatOrderData.Orders.customerName=row.name;
	CreatOrderData.Orders.creater=userStore.nickname;
	//CreatOrderData.Orders.goodSum=0;

	console.log(queryParamsCustomer);
	getCustomerPage(queryParamsCustomer).then(({ data }) => {

		Object.assign(formDataCustomer, data.list[0]);


	});

}
function closeCreatOrderDialog() {

	CreateOrderdialog.visible = false;
	//resetForm();
}


function CreatOrder(){
	{
		loading.value = true;
		CreatOrderfunction(CreatOrderData)
			.then(() => {
				ElMessage.success("创建成功");
				closeCreatOrderDialog();

				handleQueryCustomer();
			})
			.finally(() => (loading.value = false));
	}
}

/**
 * 关闭弹窗
 */
function closeDialog() {
	dialog.visible = false;
	//resetForm();
}

function closeCreateOrderDialog() {
	CreateOrderdialog.visible = false;
	resetCreatOrderData();
}
/**
 * 重置表单
 */
function resetForm() {
	userFormRef.value.resetFields();
	userFormRef.value.clearValidate();

	formData.id = undefined;
	formData.status = 1;
}

function resetCreatOrderData() {
	CreatOrderData.Orders={
		goodSum:0
	},
		CreatOrderData.Goods=[]


}

/**
 * 表单提交
 */
const handleSubmit = useThrottleFn(() => {
	CustomerFormRef.value.validate((valid: any) => {
		if (valid) {
			//const CustomerId = formDataCustomer.id;
			loading.value = true;
			addCustomer(formDataCustomer)
				.then(() => {
					ElMessage.success("新增用户成功");
					closeDialog();
					resetQuery();
					handleQueryCustomer();
				})
				.finally(() => (loading.value = false));
		}
	});
}, 3000);



onMounted(() => {

	handleQueryOrder();
	handleQueryGood();
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
									@keyup.enter="handleQueryCustomer"
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

						<!-- 具体数据 -->
						<el-table-column
								key="id"
								label="编号"
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
								label="货物数量"
								width="100"
								align="center"
								prop="goodSum"
						/>
						<el-table-column
								label="商品说明"
								align="center"
								prop="explain"
								width="100"
						/>
						<el-table-column
								label="备注信息"
								align="center"
								prop="remark"
								width="100"
						/>
						<el-table-column
								label="订单日期"
								align="center"
								prop="orderDate"
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
								width="100"
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
								label="货物状态"
								align="center"
								prop="goodStatus"
								width="100"
						/>

						<!-- 一些操作按钮 -->
						<el-table-column label="操作" fixed="right" width="70">
							<template #default="scope">
								<el-button
										type="primary"
										size="small"
										link
										@click="displayOrderInfo(scope.row)"
								>详细信息</el-button>

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

		<!-- <el-col :lg="20" :xs="24"> -->

		<!-- </el-col> -->
		<el-container>
			<el-card>
				<el-header>Header</el-header>
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
								key="id"
								label="编号"
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
						<el-table-column
								label="客户id"
								align="center"
								prop="customerId"
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



		<!-- 表单弹窗1 -->
		<el-dialog
				v-model="dialog.visible"
				:title="dialog.title"
				width="600px"
				append-to-body
				@close="closeDialog"
		>
			<!--记得写rules-->

			<el-form
					ref="CustomerFormRef"
					:model="formDataCustomer"

					:rules="rules"
					label-width="80px"
			>
				<el-form-item label="用户名" prop="name">
					<el-input
							v-model="formDataCustomer.name"

							placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item label="身份证号码" prop="idcard">
					<el-input
							v-model="formDataCustomer.idcard"

							placeholder="请输入身份证号码"
					/>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input
							v-model="formDataCustomer.address"

							placeholder="请输入地址"
					/>
				</el-form-item>
				<el-form-item label="固定电话号码" prop="addressphone">
					<el-input
							v-model="formDataCustomer.addressphone"

							placeholder="请输入固定电话号码"
					/>
				</el-form-item>

				<el-form-item label="手机号码" prop="mobilephone">
					<el-input
							v-model="formDataCustomer.mobilephone"
							placeholder="请输入手机号码"
							maxlength="11"
					/>
				</el-form-item>

				<el-form-item label="工作单位" prop="work">
					<el-input
							v-model="formDataCustomer.work"

							placeholder="请输入工作单位"
					/>
				</el-form-item>
				<el-form-item label="邮编" prop="postcode">
					<el-input
							v-model="formDataCustomer.postcode"

							placeholder="请输入邮编"
					/>
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input
							v-model="formDataCustomer.email"
							placeholder="请输入邮箱"
							maxlength="50"
					/>
				</el-form-item>


			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleSubmit">确 定</el-button>
					<el-button @click="closeDialog">取 消</el-button>
				</div>
			</template>
		</el-dialog>



		<!-- 表单弹窗2-create-order -->
		<el-dialog
				v-model="CreateOrderdialog.visible"
				:title="CreateOrderdialog.title"
				width="1100px"
				append-to-body
				@close="closeCreateOrderDialog"
		>




			<!--记得写rules-->

			<el-steps :active="active" finish-status="success">
				<el-step title="第一步" />
				<el-step title="第二步" />
			</el-steps>

			<div
					:model="CreatOrderData">

				<div v-show="active == 1">
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>填写送货信息</span>
								<el-button class="button" text></el-button>
							</div>
						</template>
						<!--row1-->
						<el-row >
							<el-col span="12">
								<el-form-item label="用户名" prop="customer_name">
									<el-input

											v-model="formDataCustomer.name"
											:placeholder=formDataCustomer.name
											readonly="readonly"

									/>
								</el-form-item>
							</el-col>
							<el-col span="12">
								<el-form-item label="地址" prop="customer_address">
									<el-input
											v-model="formDataCustomer.address"
											readonly="readonly"
											placeholder="请输入地址"
									/>
								</el-form-item>
							</el-col>
							<el-col span="12">
								<el-form-item label="固定电话" prop="addressphone">
									<el-input
											v-model="formDataCustomer.addressphone"

											placeholder="请输入固定电话号码"
											readonly="readonly"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!--row2-->

						<el-row>

							<el-col span="12">
								<el-form-item label="手机号码" prop="mobilephone">
									<el-input
											v-model="formDataCustomer.mobilephone"
											placeholder="请输入手机号码"
											readonly="readonly"
											maxlength="11"
									/>
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="工作单位" prop="work">
									<el-input
											v-model="formDataCustomer.work"
											readonly="readonly"

											placeholder="请输入工作单位"
									/>
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="邮编" prop="postcode">
									<el-input
											v-model="formDataCustomer.postcode"
											readonly="readonly"
											placeholder="请输入邮编"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!--row3-->

						<el-row>
							<el-col span="12">
								<el-form-item label="接收人姓名" prop="receiveName">
									<el-input v-model="CreatOrderData.Orders.receiveName" />
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="接收人电话" prop="mobilephone">
									<el-input v-model="CreatOrderData.Orders.mobilephone" />
								</el-form-item>
							</el-col>

						</el-row>

						<!--row4-->

						<el-row>
							<el-col span="8">
								<el-form-item label="订单类型" prop="order_type">
									<el-select
											v-model="CreatOrderData.Orders.orderType"
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
											v-model="CreatOrderData.Orders.substation"
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
											v-model="CreatOrderData.Orders.deliveryDate"
											type="datetime"
											placeholder="Select date and time"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!--row 5-->

						<el-row>
							<el-col span="12">
								<el-form-item label="是否索要发票" prop="work">
									<el-radio-group
											v-model="CreatOrderData.Orders.isInvoice"
											class="ml-4"
									>
										<el-radio label="1" size="large">是</el-radio>
										<el-radio label="2" size="large">否</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="送货地址" prop="work">
									<el-input v-model="CreatOrderData.Orders.customerAddress" />
								</el-form-item>
							</el-col>

							<el-col span="12">
								<el-form-item label="收件人邮编" prop="work">
									<el-input v-model="CreatOrderData.Orders.postcode" />
								</el-form-item>
							</el-col>
						</el-row>

						<!--row 6-->
						<el-row>
							<el-col span="12">
								<el-form-item label="备注信息" prop="explain">
									<el-input v-model="CreatOrderData.Orders.explain" />
								</el-form-item>
							</el-col>
						</el-row>



					</el-card>
				</div>


				<!--下一步-->

				<div v-show="active >= 2">

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
						<!-- 选中框行 -->
						<!-- <el-table-column type="selection" width="50" align="center" /> -->

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
						<el-form-item label="商品总额是" props="GoodSum" >
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

				</div>
			</div>



			<template #footer>
				<div class="dialog-footer">
					<el-row >

						<el-button v-if="active < 2" style="margin-top: 12px" @click="next"
						>下一步</el-button
						>
						<el-button v-if="active > 1" style="margin-top: 12px" @click="pre"
						>上一步</el-button
						>
						<el-button style="margin-top: 12px" @click="closeCreateOrderDialog">取 消</el-button>


						<el-button type="primary"  v-show="active >= 2"  style="margin-top: 12px;"  @click="CreatOrder">创建订单</el-button>


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
