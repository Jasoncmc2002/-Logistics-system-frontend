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
  invoice,
  invoicePageVO,
  invoiceQuery,
} from "@/api/financial/invoice/types";

/**
 * 导入UI
 */
import { FormInstance, FormRules, UploadFile } from "element-plus";

import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import { addInvoice, getInvoice } from "@/api/financial/invoice";
import { SupplyQuery } from "@/api/financial/supply/types";
import { getSupplyMoney } from "@/api/financial/supply";

/**
 * 定义ElementUI组件
 */

const queryFormRef = ref<FormInstance>(); // 查询表单

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
const dialogFormVisible = ref(false);
const dialog = reactive<DialogOption>({
  visible: false,
});
const form = reactive<invoice>({
  invoiceClass: "",
  startNumber: 1,
  endNumber: 100000,
  batch: "",
  name: "",
});
const queryParams = reactive<invoiceQuery>({
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2023, 10, 10, 10, 10),
  startTime: new Date(2021, 10, 11, 10, 10),
  invoiceClass: "",
  invoiceStartNumber: 1,
  invoiceEndNumber: 100000,
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
const options = [
  {
    value: "",
    label: "全部",
  },
  {
    value: "登记",
    label: "登记",
  },
  {
    value: "领用",
    label: "领用",
  },
  {
    value: "退回",
    label: "退回",
  },
  {
    value: "作废",
    label: "作废",
  },
  {
    value: "作废",
    label: "作废/丢失",
  },
];
//发票状态选择器1
const options1 = [
  {
    value: "登记",
    label: "登记",
  },
  {
    value: "领用",
    label: "领用",
  },
  {
    value: "退回",
    label: "退回",
  },
  {
    value: "作废",
    label: "作废/丢失",
  },
];
const invoiceList = ref<invoicePageVO[]>();
const chinaOptions = { timeZone: "Asia/Shanghai", hour12: false };

const rules = reactive<FormRules<invoiceQuery>>({
  invoiceStartNumber: [
    {
      required: true,
      message: "请输入发票的开始号码",
      trigger: "change",
    },
  ],
  invoiceEndNumber: [
    {
      required: true,
      message: "请输入发票的结束号码",
      trigger: "change",
    },
  ],
});
/**
 * 查询
 */

const handleQuery = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
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
    } else {
      ElMessage({
        type: "info",
        message: "请正确输入！",
      });
    }
  });
};
/*增加*/
function addQuery() {
  dialogFormVisible.value = false;
  loading.value = true;
  addInvoice(form)
    .then(({}) => {
      handleQuery(queryFormRef);
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
  handleQuery(queryFormRef);
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

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
}

onMounted(() => {
  handleQuery(queryFormRef); // 初始化用户列表数据
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 搜索栏 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form
            ref="queryFormRef"
            :model="queryParams"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="发票开始号码" prop="invoiceStartNumber">
              <el-input
                v-model.number="queryParams.invoiceStartNumber"
                placeholder=" "
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery(queryFormRef)"
              />
            </el-form-item>
            <el-form-item label="发票结束号码" prop="invoiceEndNumber">
              <el-input
                v-model.number="queryParams.invoiceEndNumber"
                placeholder=" "
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery(queryFormRef)"
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
            <el-form-item label="选择发票状态">
              <el-select
                v-model="queryParams.invoiceClass"
                class="m-2"
                placeholder="Select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="handleQuery"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery(queryFormRef)"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
              <el-button type="primary" @click="dialogFormVisible = true">
                <i-ep-refresh />
                表单管理</el-button
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
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="invoiceClass"
              label="类型"
              align="center"
              prop="invoiceClass"
              width="100"
            />
            <el-table-column
              key="startNumber"
              label="开始号码"
              align="center"
              prop="startNumber"
              width="200"
            />
            <el-table-column
              label="结束号码"
              width="200"
              align="center"
              prop="endNumber"
            />

            <el-table-column
              label="批次"
              width="100"
              align="center"
              prop="batch"
            />

            <el-table-column
              label="姓名"
              width="120"
              align="center"
              prop="name"
            />
            <el-table-column
              label="日期"
              align="center"
              prop="date"
              width="300"
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
    <el-dialog v-model="dialogFormVisible" title="发票管理">
      <el-form :model="form">
        <el-form-item label="发票批次" :label-width="formLabelWidth">
          <el-input v-model="form.batch" autocomplete="off" />
        </el-form-item>
        <el-form-item label="发票类型" :label-width="formLabelWidth">
          <el-select v-model="form.invoiceClass" placeholder="登记">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发票开始号码" :label-width="formLabelWidth">
          <el-input v-model="form.startNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="发票结束号码" :label-width="formLabelWidth">
          <el-input v-model="form.endNumber" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="addQuery"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
