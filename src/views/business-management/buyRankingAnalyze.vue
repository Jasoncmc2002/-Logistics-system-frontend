<script setup lang="ts">
defineOptions({
  name: "buy-ranking-analyze",
  inheritAttrs: false,
});

import { GoodPageVO, GoodQuery, GoodForm } from "@/api/good/types";
import { getRanking } from "@/api/good/index";

const firstCategoryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<GoodQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<GoodPageVO[]>();

const formData1 = reactive<GoodForm>({});

const rules = reactive({
  name: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getRanking(queryParams1)
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
              key="id"
              label="商品代码"
              prop="id"
              width="200"
              align="center"
            />
            <el-table-column
              key="goodName"
              label="商品名称"
              prop="goodName"
              align="center"
              width="200"
            />
            <el-table-column
              key="goodNumber"
              label="订购数量"
              prop="goodNumber"
              width="200"
              align="center"
            />

            <el-table-column
              key="supply"
              label="供应商"
              prop="supply"
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
