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
  addUser,
  updateUser,
  updateUserStatus,
  updateUserPassword,
  downloadTemplateApi,
  exportUser,
  importUser,
} from "@/api/user";

// new api
import { getOrderPage } from "@/api/order";
import { getCustomerPage,getCustomerForm } from "@/api/customer";

/**
 * 导入需要的dept与role相关的API
 */
import { listDeptOptions } from "@/api/dept";
import { listRoleOptions } from "@/api/role";

/**
 * 导入API所需要的数据类型
 */
import { UserForm, UserQuery, UserPageVO } from "@/api/user/types";

// new type

import { GoodQuery,GoodPageVO,GoodForm, OrderForm, OrderPageVO, OrderQuery } from "@/api/order/types";
import { getGoodPage } from "@/api/order";

import { CustomerQuery ,CustomerPageVO,CustomerForm} from "@/api/customer/types";


/**
 * 定义ElementUI组件
 */
const deptTreeRef = ref(ElTree); // 部门树
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

// new queryParams

const queryParamsOrder = reactive<OrderQuery>({
  pageNum: 1,
  pageSize: 5,
});

const queryParamsGood = reactive<GoodQuery>({
  pageNum: 1,
  pageSize: 5,
  
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

const formData = reactive<UserForm>({
  status: 1,
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
    value: '订单类型1',
    label: '订单类型1',
  },
  {
    value: '订单类型2',
    label: '订单类型2',
  },
  {
    value: '订单类型3',
    label: 'Option3',
  },
  {
    value: '订单类型4',
    label: '订单类型4',
  },
  {
    value: '订单类型5',
    label: '订单类型5',
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

/**
 * watchEffect会监听所引用数据类型的所有属性（这里监听的是seachDeptName）
 * 满足filter中的value的内容会被保留，其它除去（返回一份新的数据，不影响原来数据）
 */
watchEffect(
  () => {
    deptTreeRef.value.filter(searchDeptName.value);
  },
  {
    flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/**
 * 部门筛选
 */
function handleDeptFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  // !==就是!= 这里是在判断，data数据中是否有叫value的部门
  return data.label.indexOf(value) !== -1;
}

/**

 */
function handleDeptNodeClick(data: { [key: string]: any }) {
  queryParams.deptId = data.value;
  handleQuery();
}

/**
 * 获取角色下拉列表
 */
async function getRoleOptions() {
  listRoleOptions().then((response) => {
    roleList.value = response.data;
  });
}

/**
 * 修改用户状态
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === 1 ? "启用" : "停用";
  ElMessageBox.confirm("确认要" + text + row.username + "用户吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return updateUserStatus(row.id, row.status);
    })
    .then(() => {
      ElMessage.success(text + "成功");
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1;
    });
}

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
 
  getOrderPage(queryParamsOrder)
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

//


/**
 * 重置密码
 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  )
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning("请输入新密码");
        return false;
      }
      updateUserPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    })
    .catch(() => {});
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
  //await getDeptOptions();
  //await getRoleOptions();
  dialog.visible = true;
  if (userId) {
    dialog.title = "修改用户";
    getUserForm(userId).then(({ data }) => {
      Object.assign(formDataCustomer, data);
    });
  } else {
    dialog.title = "新增用户";
  }
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
  console.log(queryParamsCustomer);
    getCustomerPage(queryParamsCustomer).then(({ data }) => {
      Object.assign(formDataCustomer, data.list[0]);
      console.log(formDataCustomer);
    });
  
}

// new openDialog
async function openDialogOrder(orderId?: number) {
  // await getDeptOptions();
  // await getRoleOptions();
  // dialog.visible = true;
  // if (orderId) {
  //   dialog.title = "修改订单";
  //   getOrderForm(orderId).then(({ data }) => {
  //     Object.assign(formData, data);
  //   });
  // } else {
  //   dialog.title = "新增用户";
  // }
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
  //resetForm();
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

/**
 * 表单提交
 */
const handleSubmit = useThrottleFn(() => {
  CustomerFormRef.value.validate((valid: any) => {
    if (valid) {
      //const CustomerId = formDataCustomer.id;
      loading.value = true;
        addUser(formDataCustomer)
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

/**
 * 删除用户
 */
function handleDelete(id?: number) {
  const userIds = [id || ids.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    deleteUsers(userIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/**
 * 获取部门下拉项
 */
async function getDeptOptions() {
  listDeptOptions().then((response) => {
    deptList.value = response.data;
  });
}

/**
 * 下载导入模板
 */
function downloadTemplate() {
  downloadTemplateApi().then((response: any) => {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob); // 下载链接
    a.href = href;
    a.download = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击下载
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

/**
 * 打开导入弹窗
 */
async function openImportDialog() {
  await getDeptOptions();
  importDeptId.value = undefined;
  importDialog.visible = true;
}

/**
 * Excel文件change事件
 *
 * @param file
 */
function handleExcelChange(file: UploadFile) {
  if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
    ElMessage.warning("上传Excel只能为xlsx、xls格式");
    excelFile.value = undefined;
    excelFilelist.value = [];
    return false;
  }
  excelFile.value = file.raw;
}

/**
 * 导入用户提交
 */
function handleUserImport() {
  if (importDeptId.value) {
    if (!excelFile.value) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    importUser(importDeptId.value, excelFile.value).then((response) => {
      ElMessage.success(response.data);
      closeImportDialog();
      resetQuery();
    });
  }
}

/**
 * 关闭导入弹窗
 */
function closeImportDialog() {
  importDialog.visible = false;
  excelFile.value = undefined;
  excelFilelist.value = [];
}

/**
 * 导出用户
 */
function handleUserExport() {
  exportUser(queryParams).then((response: any) => {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob); // 下载的链接
    a.href = href;
    a.download = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击导出
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}


onMounted(() => {
  getDeptOptions(); // 初始化部门
  //handleQuery(); // 初始化用户列表数据
  handleQueryOrder();
  //handleQueryCustomer();
  handleQueryGood();
});


</script>

<template>
  <div class="app-container">
    <!-- <el-row :gutter="20"> -->
      <!-- 部门树 -->
      <!-- <el-col :lg="4" :xs="24" class="mb-[12px]"> -->
        <el-card shadow="never">
          <el-input v-model="searchDeptName" placeholder="部门名称" clearable>
            <template #prefix>
              <i-ep-search />
            </template>
          </el-input>

          <el-tree
            ref="deptTreeRef"
            class="mt-2"
            :data="deptList"
            :props="{ children: 'children', label: 'label', disabled: '' }"
            :expand-on-click-node="false"
            :filter-node-method="handleDeptFilter"
            default-expand-all
            @node-click="handleDeptNodeClick"
          ></el-tree>
        </el-card>
      <!-- </el-col> -->

      <!-- 搜索栏 -->
      <!-- <el-col :lg="20" :xs="24"> -->
        <div class="search-container">
          <el-form ref="CustomerFormRef" :model="queryParamsCustomer" :inline="true">
            <el-form-item label="用户搜索" prop="keywords">
              <el-input
                v-model="queryParamsCustomer.name"
                placeholder="姓名"
                clearable
                style="width: 200px"
                @keyup.enter="handleQueryCustomer"
              />
              <el-input
                v-model="queryParamsCustomer.idcard"
                placeholder="身份证"
                clearable
                style="width: 200px"
                @keyup.enter="handleQueryCustomer"
              />
              <el-input
                v-model="queryParamsCustomer.mobilephone"
                placeholder="手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQueryCustomer"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQueryCustomer"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
              <el-button
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="openDialog()"
                  ><i-ep-plus />新增用户</el-button
                >
            </el-form-item>
          </el-form>
           <el-table
            v-loading="loading"
            :data="customerList"
            @selection-change="handleSelectionChange"
          >
          
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="name"
              label="用户名"
              align="center"
              prop="name"
            />
            
            <el-table-column
              label="身份证号码"
              width="100"
              align="center"
              prop="idcard"
            />

            <el-table-column
              label="地址"
              width="120"
              align="center"
              prop="address"
            />
            <el-table-column
              label="手机号码"
              align="center"
              prop="mobilephone"
              width="120"
            />
            <el-table-column
              label="固定电话"
              width="120"
              align="center"
              prop="addressphone"
            />
            <el-table-column
              label="工作单位"
              align="center"
              prop="work"
              width="180"
            />
            <el-table-column
              label="邮编"
              align="center"
              prop="postcode"
              width="180"
            />
            <el-table-column
              label="email"
              align="center"
              prop="email"
              width="180"
            >
          </el-table-column>

            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.id)"
                  ><i-ep-edit />编辑</el-button
                >
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                  ><i-ep-delete />删除</el-button
                >
              <el-button 
                type="primary" 
                size="small"
                @click="openCreateOrderDialog(scope.row)"
                >创建订单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParamsCustomer.pageNum"
            v-model:limit="queryParamsCustomer.pageSize"
            @pagination="handleQueryCustomer"
          />
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <!-- <div>
                <el-button
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="openDialog()"
                  ><i-ep-plus />新增</el-button
                >
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="danger"
                  :disabled="ids.length === 0"
                  @click="handleDelete()"
                  ><i-ep-delete />删除</el-button
                >
              </div> -->

              <!-- <div>
                <el-dropdown split-button>
                  导入
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="downloadTemplate">
                        <i-ep-download />下载模板</el-dropdown-item
                      >
                      <el-dropdown-item @click="openImportDialog">
                        <i-ep-top />导入数据</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button class="ml-3" @click="handleUserExport"
                  ><template #icon><i-ep-download /></template>导出</el-button
                >
              </div> -->

            </div>
          </template>

          <el-container>

      <el-header>订单信息</el-header>
      <el-main>
        <el-table
            v-loading="loading"
            :data="orderList"
            @selection-change="handleSelectionChangeOrder"
            
          >
          
            <!-- 选中框行 -->
            <el-table-column type="selection" width="50" align="center" />
          
            <!-- 具体数据 -->
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
           
            <el-table-column
              
              label="创建者"
              align="center"
              prop="creater"
            />
            <el-table-column
              label="货物数量"
              width="120"
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
              prop="receive_name"
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

        <!-- <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        
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
    <el-step title="第三步" />
    <el-step title="第四步" />
</el-steps>
      <el-form
        ref="CustomerFormRef"
        :model="formDataCustomer"
        
        :rules="rules"
        label-width="110px"
      >

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
        <el-col span="8">
          <el-form-item label="接收人" prop="receive_name">
          <el-input
            v-model="formDataCustomer.work"
            
          />
        </el-form-item>

        </el-col>

        <el-col span="16">
          <el-form-item label="接收人电话" prop="work">
          <el-input
            v-model="formDataCustomer.work"
            
          />
        </el-form-item>

        </el-col>

        <el-col span="12">
          <el-form-item label="订单生成日期" prop="order_date">
            <el-date-picker
        v-model="formDataOrder.order_date"
        type="datetime"
        placeholder="Select date and time"
      />
        </el-form-item>

        </el-col>
        
       </el-row>
        
    <!--row4-->

      <el-row>
        <el-col span="8">
          <el-form-item label="订单类型" prop="order_type" >
            <el-select v-model="formDataOrder.order_type" class="m-2" placeholder="订单类型" >
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
            <el-select v-model="formDataOrder.order_type" class="m-2" placeholder="选择分站" >
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
        v-model="formDataOrder.order_date"
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
            <el-radio-group v-model="formDataOrder.is_invoice" class="ml-4">
      <el-radio label="1" size="large">是</el-radio>
      <el-radio label="2" size="large">否</el-radio>
    </el-radio-group>
        </el-form-item>

        </el-col>
        

        <el-col span="12">
          <el-form-item label="送货地址" prop="work">
          <el-input
            v-model="formDataCustomer.work"
            
          />
        </el-form-item>

        </el-col>

        <el-col span="12">
          <el-form-item label="收件人邮编" prop="work">
          <el-input
            v-model="formDataCustomer.work"
            
          />
        </el-form-item>

        </el-col>

       </el-row>

    <!--row 6-->
      <el-row>
        <el-col span="12">
          <el-form-item label="备注信息" prop="explain">
            <el-input
            v-model="formDataCustomer.work"
            
          />
        </el-form-item>

        </el-col>

       </el-row>
        
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="active < 4" style="margin-top: 12px" @click="next">下一步</el-button>
<el-button v-if="active > 1" style="margin-top: 12px" @click="pre">上一步</el-button>

          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeCreateOrderDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog
      v-model="importDialog.visible"
      :title="importDialog.title"
      width="600px"
      append-to-body
      @close="closeImportDialog"
    >
      <el-form label-width="80px">
        <el-form-item label="部门">
          <el-tree-select
            v-model="importDeptId"
            placeholder="请选择部门"
            :data="deptList"
            filterable
            check-strictly
          />
        </el-form-item>

        <el-form-item label="Excel">
          <el-upload
            class="upload-demo"
            action=""
            drag
            :auto-upload="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :file-list="excelFilelist"
            :on-change="handleExcelChange"
            :limit="1"
          >
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">xls/xlsx files</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUserImport">确 定</el-button>
          <el-button @click="closeImportDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
