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
  name: "withdraw",
  inheritAttrs: false,
});

import {
  insertBuyForm,
  deleteBuyForm,
  getBuyPage,
  getBuyForm,
  updateBuyForm,
  withdrawal,
} from "@/api/buy";

import {
  CentralStationPageVO,
  CentralStationForm,
  CentralStationQuery,
} from "@/api/good/types";
import { BuyPageVO, BuyForm, BuyQuery } from "@/api/buy/types";

const CentralStationFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<BuyQuery>({
  pageNum: 1,
  pageSize: 10,
});

const userList1 = ref<CentralStationPageVO[]>();

const formData1 = reactive<CentralStationForm>({});

// const supplyList=reactive({});
// const firstCategoryList=reactive({});
// const secondaryCategoryList=reactive({});
var list = reactive<number>({});

const rules = reactive({
  // fname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getBuyPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
    })

    .finally(() => {
      loading.value = false;
    });
}

function resetQuery1() {
  // CentralStationFormRef.value.resetFields();
  // console.log("OK");
  queryParams1.supplyName = null;
  queryParams1.endTime = null;
  queryParams1.startTime = null;
  queryParams1.id = null;
  queryParams1.pageNum = 1;
  handleQuery1();
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

async function openDialog1(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改";
    getBuyForm(id).then(({ data }) => {
      Object.assign(formData1, data);
    });
  } else {
    dialog.title = "新增";
  }
}

function closeDialog1() {
  dialog.visible = false;
  resetForm1();
}

function resetForm1() {
  CentralStationFormRef.value.resetFields();
  CentralStationFormRef.value.clearValidate();
  formData1.id = undefined;
}

function withdrawal1() {
  loading.value = true;
  withdrawal(list)
    .then(({ data }) => {
      ElMessage.success("中心退货记录批量增加成功");
      resetQuery1();
    })

    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  handleQuery1();
});
</script>

<template>
  <div class="app-container">
    <el-row>
      <!-- 搜索栏 -->
      <el-col :lg="24" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            <el-form-item label="商品号" prop="id">
              <el-input
                v-model="queryParams1.id"
                placeholder="请输入商品号"
                clearable
                style="width: 200px"
              />
            </el-form-item>

            <el-form-item label="供应商姓名" prop="supplyName">
              <el-input
                v-model="queryParams1.supplyName"
                placeholder="输入供应商姓名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="起始时间" prop="startTime">
              <el-date-picker
                v-model="queryParams1.startTime"
                placeholder="选择起始时间"
                clearable
                type="datetime"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="queryParams1.endTime"
                placeholder="选择结束时间"
                clearable
                type="datetime"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery1"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery1">
                <i-ep-refresh />
                重置</el-button
              >
              <el-button @click="withdrawal1"> 退货确认</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div></div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="userList1"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <!--            <el-table-column type="selection" width="50" align="center" />-->
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="goodName"
              label="商品名"
              align="center"
              prop="goodName"
            />
            <el-table-column
              key="goodId"
              label="商品编号"
              align="center"
              prop="goodId"
            />

            <el-table-column
              label="已退货量"
              key="withdrawal"
              width="120"
              align="center"
              prop="withdrawal"
            />
            <el-table-column
              label="可分配量"
              key="waitAllo"
              width="120"
              align="center"
              prop="waitAllo"
            />

            <el-table-column
              label="计量单位"
              key="goodUnit"
              width="120"
              align="center"
              prop="goodUnit"
            />
            <el-table-column
              label="订单状态"
              key="buyTypeName"
              width="120"
              align="center"
              prop="buyTypeName"
            />
            <el-table-column
              label="订单种类"
              key="typeName"
              width="120"
              align="center"
              prop="typeName"
            />

            <el-table-column
              label="供货商姓名"
              key="supply"
              width="120"
              align="center"
              prop="supply"
            />

            <el-table-column label="退货量" fixed="right" width="220">
              <template #default="scope">
                <el-input v-model="list[scope.row.id]" clearable />
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams1.pageNum"
            v-model:limit="queryParams1.pageSize"
            @pagination="handleQuery1"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
