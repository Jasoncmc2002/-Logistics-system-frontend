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

import { stationPageVO, StationQuery } from "@/api/financial/station/types";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

/**
 * 导入UI
 */

import { getStationMoney } from "@/api/financial/station";

/**
 * 定义ElementUI组件
 */

const queryFormRef = ref(ElForm); // 查询表单

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

const queryParams = reactive<StationQuery>({
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2023, 10, 10, 10, 10),
  startTime: new Date(2021, 10, 11, 10, 10),
  station: "中山分站",
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

const moneyList = ref<stationPageVO[]>();
const sumMoney = ref(0);
const getMoney = ref(0);
const returnMoney = ref(0);

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getStationMoney(queryParams)
    .then(({ data }) => {
      moneyList.value = data.pageInfo.list;
      total.value = data.pageInfo.total;
      sumMoney.value = data.sumMoney;
      getMoney.value = data.getMoney;
      returnMoney.value = data.returnMoney;
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
  queryParams.deptId = undefined;
  handleQuery();
}

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
}

/**
 * 表单提交
 */

onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});

//上传图片
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";

const upload = ref<UploadInstance>();

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const submitUpload = () => {
  upload.value.submit();
  console.warn(upload.value);
};
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 搜索栏 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="分站名称">
              <el-input
                v-model="queryParams.station"
                placeholder="中山分站"
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
            <el-form-item>
              <el-upload
                ref="upload"
                class="upload-demo"
                action="/dev-api/financial/goodAili"
                :headers="false"
                :limit="1"
                method="post"
                :on-exceed="handleExceed"
                :auto-upload="false"
              >
                <template #trigger>
                  <el-button type="primary">智能商品识别</el-button>
                </template>
                <el-button class="ml-3" type="success" @click="submitUpload">
                  upload to server
                </el-button>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    limit 1 file, new file will cover the old file
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="moneyList"
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
            <el-table-column label="商品类别" align="center" prop="goodClass" />
            <el-table-column
              label="商品名称"
              width="120"
              align="center"
              prop="goodName"
            />

            <el-table-column
              label="送货数量"
              width="100"
              align="center"
              prop="goodGetNumber"
            />

            <el-table-column
              label="收款额"
              width="120"
              align="center"
              prop="goodGetMoney"
            />
            <el-table-column
              label="退回数量"
              align="center"
              prop="goodReturnNumber"
              width="120"
            />
            <el-table-column
              label="退款额"
              align="center"
              prop="goodReturnMoney"
              width="120"
            />

            <!--            <el-table-column label="操作" fixed="right" width="220">-->
            <!--              <template #default="scope">-->
            <!--                <el-button-->
            <!--                  v-hasPerm="['sys:user:reset_pwd']"-->
            <!--                  type="primary"-->
            <!--                  size="small"-->
            <!--                  link-->
            <!--                  @click="resetPassword(scope.row)"-->
            <!--                  ><i-ep-refresh-left />支付</el-button-->
            <!--                >-->
            <!--              </template>-->
            <!--            </el-table-column>-->
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
  </div>
</template>
