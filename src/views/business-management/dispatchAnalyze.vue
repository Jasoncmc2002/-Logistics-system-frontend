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
  name: "dispatch-analyze",
  inheritAttrs: false,
});

import { AnalyzePageVO, AnalyzeQuery, AnalyzeForm } from "@/api/analyze/types";
import { getAnalyzePage } from "@/api/analyze/index";

const firstCategoryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<AnalyzeQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<AnalyzePageVO[]>();

const formData1 = reactive<AnalyzeForm>({});

const rules = reactive({
  name: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getAnalyzePage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      console.log(userList1.value);
      total.value = data.total;
    })

    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */

function resetQuery1() {
  // firstCategoryFormRef.value.resetFields();
  queryParams1.startTime = null;
  queryParams1.endTime = null;
  queryParams1.pageNum = 1;
  handleQuery1();
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

function resetForm1() {
  firstCategoryFormRef.value.resetFields();
  firstCategoryFormRef.value.clearValidate();
  formData1.id = undefined;
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
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div></div>
            </div>
          </template>

          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="userList1"
            @selection-change="handleSelectionChange"
          >
            <!--            <el-table-column type="selection" width="100" />-->
            <el-table-column
              key="stationName"
              label="货站名称"
              prop="stationName"
              width="200"
              align="center"
            />
            <el-table-column
              key="number"
              label="送货商品数量"
              prop="number"
              align="center"
              width="200"
            />
            <el-table-column
              key="totalTask"
              label="完成任务数"
              prop="totalTask"
              width="200"
              align="center"
            />

            <el-table-column
              key="totalMoney"
              label="送货付款总额"
              prop="totalMoney"
              width="200"
              align="center"
            />
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
