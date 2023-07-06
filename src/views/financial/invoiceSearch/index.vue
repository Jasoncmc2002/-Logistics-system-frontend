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

//TODO: inheritAttrs是干嘛的？

import {
  invoicePageVO,
  invoiceQuery,
} from "@/api/financial/invoiceSearch/types";

/**
 * 导入UI
 */
import { UploadFile } from "element-plus";

import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import { getInvoice } from "@/api/financial/invoiceSearch";

/**
 * 定义ElementUI组件
 */

const queryFormRef = ref(ElForm); // 查询表单

const userFormRef = ref(ElForm); // 用户表单

/**
 * ref本质也是reactive，ref(obj)等价于reactive({value: obj}) : 用于定义响应式变量
 * 定义所需变量
 * loading : 反馈是否数据加载完成
 * TODO:
 * ids : ?
 * total : ?
 * dalog : ? 弹窗
 * queryParams : ?
 * moneyPageVO : 对应用户表中的数据
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
const total = ref(0);

const queryParams = reactive<invoiceQuery>({
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2023, 10, 10, 10, 10),
  startTime: new Date(2021, 10, 11, 10, 10),
  invoiceNumber: "",
  username: "",
});

//日期选择器
const shortcuts = [
  {
    text: "Today",
    value: new Date(),
  },
  {
    text: "Yesterday",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "A week ago",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];
//发票状态选择器
const invoiceList = ref<invoicePageVO[]>();

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getInvoice(queryParams)
    .then(({ data }) => {
      console.warn(data);
      invoiceList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/**
 * 支付金额
 */
function Alipay(row: { [key: string]: any }) {
  ElMessageBox.confirm("将跳转到支付宝支付，请确认本次支付", "确认支付", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      window.open(
        "http://localhost:8088/financial/alipay/pay?subject=" +
          row.goodName +
          "&traceNo=" +
          "aasss" +
          "_" +
          row.id +
          "&totalAmount=" +
          row.goodSettleMoney
      );
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "支付关闭",
      });
    });
}

onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 搜索栏 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="发票号码">
              <el-input
                v-model="queryParams.invoiceNumber"
                placeholder=" "
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发票使用人">
              <el-input
                v-model="queryParams.username"
                placeholder=" "
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="选择时间段">
              <el-date-picker
                v-model="queryParams.startTime"
                type="datetime"
                placeholder="开始时间"
                :shortcuts="shortcuts"
              />
              <el-date-picker
                v-model="queryParams.endTime"
                type="datetime"
                placeholder="结束时间"
                :shortcuts="shortcuts"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <!-- 表单开始位置 -->
          <el-table
            v-loading="loading"
            :data="invoiceList"
            @selection-change="handleSelectionChange"
          >
            <!-- 应该是导出用的-->
            <el-table-column
              key="invoiceId"
              label="发票号"
              align="center"
              prop="number"
              width="100"
            />
            <el-table-column
              key="batch"
              label="批次"
              align="center"
              prop="batch"
              width="100"
            />
            <el-table-column
              key="orderId"
              label="订单号"
              align="center"
              prop="orderId"
              width="200"
            />
            <el-table-column
              label="金额"
              width="200"
              align="center"
              prop="money"
            />

            <el-table-column
              label="姓名"
              width="100"
              align="center"
              prop="name"
            />

            <el-table-column
              label="日期"
              width="300"
              align="center"
              prop="date"
            />
          </el-table>

          <!-- 表单结束位置 -->

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 导入弹窗 -->
  </div>
</template>
