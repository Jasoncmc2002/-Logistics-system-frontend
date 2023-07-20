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

import type {FormInstance, FormRules} from "element-plus";
/**
 * 导入UI
 */
import {getSupplyMoney} from "@/api/financial/supply";
import {supplyPageVO, SupplyQuery} from "@/api/financial/supply/types";

/**
 * 定义ElementUI组件
 */

const queryFormRef = ref<FormInstance>(); // 查询表单

const userFormRef = ref(ElForm); // 用户表单

/**
 * ref本质也是reactive，ref(obj)等价于reactive({value: obj}) : 用于定义响应式变量
 * 定义所需变量
 * loading : 反馈是否数据加载完成
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
const ids = ref([]);
const total = ref(0);
const sumMoney = ref(0);

const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams = reactive<SupplyQuery>({
  supplyName: "红牛供应商",
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2023, 10, 10, 10, 10),
  startTime: new Date(2021, 10, 11, 10, 10),
  buyType: "全部",
});
const rules = reactive<FormRules<SupplyQuery>>({
  supplyName: [
    {
      required: true,
      message: "请输入供应商的名称",
      trigger: "change",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
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
//支付状态选择器
const options = [
  {
    value: "全部",
    label: "全部",
  },
  {
    value: "已支付",
    label: "已支付",
  },
  {
    value: "未支付",
    label: "未支付",
  },
];
const deptList = ref<OptionType[]>();
const roleList = ref<OptionType[]>();
const supplyMoneyList = ref<supplyPageVO[]>();

/**
 * 查询
 */
const handleQuery = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      getSupplyMoney(queryParams)
        .then(({ data }) => {
          console.warn(data);
          supplyMoneyList.value = data.pageInfo.list;
          total.value = data.pageInfo.total;
          sumMoney.value = data.sumMoney;
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

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery(queryFormRef);
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
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
          "sssss" +
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
            <el-form-item label="供应商名称" prop="supplyName">
              <el-input
                v-model="queryParams.supplyName"
                placeholder="供应商名称"
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
            <el-form-item label="选择支付状态">
              <el-select
                v-model="queryParams.buyType"
                class="m-2"
                placeholder="Select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="supplyMoneyList"
            @selection-change="handleSelectionChange"
          >
            <!-- 应该是导出用的-->
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="goodName"
              label="商品名称"
              align="center"
              prop="goodName"
            />
            <el-table-column
              label="商品价格"
              width="120"
              align="center"
              prop="goodPrice"
            />

            <el-table-column
              label="商品进价"
              width="100"
              align="center"
              prop="goodCost"
            />

            <el-table-column
              label="商品进货量"
              width="120"
              align="center"
              prop="goodSupplyNumber"
            />
            <el-table-column
              label="商品退货量"
              align="center"
              prop="goodReturnNumber"
              width="120"
            />
            <el-table-column
              label="结算数量"
              align="center"
              prop="goodSettleNumber"
              width="120"
            />
            <el-table-column
              key="goodSettleMoney"
              label="结算额"
              align="center"
              prop="goodSettleMoney"
              width="120"
            />
            <el-table-column
              key="goodType"
              label="支付状态"
              align="center"
              prop="goodType"
              width="120"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="Alipay(scope.row)"
                  :icon="Check"
                  :disabled="scope.row.goodType == '已支付'"
                  >支付</el-button
                >
              </template>
            </el-table-column>
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
