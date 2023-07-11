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

import * as echarts from "echarts";

defineOptions({
  name: "satisfication",
  inheritAttrs: false,
});

import { ReceiptPageVO, ReceiptQuery, ReceiptForm } from "@/api/receipt/types";
import { getReceiptPage, exportExcel } from "@/api/receipt/index";
import { genChartByAiUsingPOST } from "@/api/bi";
import { BiResponse, genChartByAiUsingPOSTParams } from "@/api/bi/types";
import { UploadInstance, UploadUserFile } from "element-plus";

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});
const queryParams1 = reactive<ReceiptQuery>({
  pageNum: 1,
  pageSize: 10,
});
const queryParams2 = reactive<ReceiptQuery>({
  pageNum: 1,
  pageSize: 1000,
});
const userList1 = ref<ReceiptPageVO[]>();
const formRules = reactive({
  goal: [{ required: true, message: "请输入分析目标" }],
});
const chartTypes = [
  { value: "折线图", label: "折线图" },
  { value: "柱状图", label: "柱状图" },
  { value: "堆叠图", label: "堆叠图" },
  { value: "饼图", label: "饼图" },
  { value: "雷达图", label: "雷达图" },
];

const formData = reactive<genChartByAiUsingPOSTParams>({
  creator: "admin",
  goal: "分析",
  name: "分析",
  chartType: "折线图",
});
const res = reactive<BiResponse>({
  chartId: 0,
  genChart: "",
  genResult: "",
});
let chartOption = ref();
const submitting = ref(false);
const fileList = ref<UploadUserFile[]>();
function handleExport() {
  exportExcel().then((response: any) => {
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

// function submit(option) {
// 	submitting.value = true;
// 	genChartByAiUsingPOST(option.file, <genChartByAiUsingPOSTParams>formData)
// 		.then(({ data }) => {
// 			console.warn(data);
// 			if (data.genChart == null) {
// 				ElMessage.warning("分析失败");
// 			} else {
// 				res.chartId = data.chartId;
// 				res.genChart = data.genChart;
// 				res.genResult = data.genResult;
// 				chartOption = JSON.parse(data.genChart);
// 				if (!chartOption) {
// 					ElMessage.warning("图表代码解析错误");
// 				}
// 			}
// 		})
// 		.finally(() => {
// 			submitting.value = false;
// 		});
// }

function handleQuery1() {
  loading.value = true;
  getReceiptPage()
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
    })

    .finally(() => {
      loading.value = false;
    });
}

function resetQuery1() {
  queryParams1.pageNum = 1;
  handleQuery1();
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

function resetForm1() {}

onMounted(() => {
  handleQuery1();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 搜索栏 -->
      <el-col :span="12">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="formData" :inline="true">
            <!--            <el-form-item label="分析目标" :rules="formRules.goal">-->
            <!--              <el-input-->
            <!--                type="textarea"-->
            <!--                placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"-->
            <!--                v-model="formData.goal"-->
            <!--              ></el-input>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="图表名称">-->
            <!--              <el-input-->
            <!--                placeholder="请输入图表名称"-->
            <!--                v-model="formData.name"-->
            <!--              ></el-input>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="图表类型">-->
            <!--              <el-select v-model="formData.chartType">-->
            <!--                <el-option-->
            <!--                  v-for="option in chartTypes"-->
            <!--                  :key="option.value"-->
            <!--                  :value="option.value"-->
            <!--                  :label="option.label"-->
            <!--                ></el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->

            <el-form-item>
              <el-button @click="resetQuery1"> <i-ep-refresh />重置</el-button>
            </el-form-item>

            <el-form-item>
              <el-button class="ml-3" @click="handleExport"
                ><template #icon><i-ep-download /></template
                >导出EXCEL</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between"></div>
          </template>

          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="userList1"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              key="goodName"
              label="货物名称"
              prop="goodName"
              width="200"
              align="center"
            />
            <el-table-column
              key="customerName"
              label="用户姓名"
              prop="customerName"
              width="200"
              align="center"
            />
            <el-table-column
              key="customerSatis"
              label="用户满意度"
              prop="customerSatis"
              align="center"
              width="200"
            />
          </el-table>
        </el-card>
      </el-col>
      <!--      <el-col :span="12">-->
      <!--        <div :id="id" :class="className" :style="{ height, width }" />-->
      <!--      </el-col>-->

      <!--    <el-col :span="12">-->
      <!--      <el-card header="分析结论">-->
      <!--        <div v-loading="submitting">{{ res.genResult }}</div>-->
      <!--      </el-card>-->
      <!--      <el-divider></el-divider>-->
      <!--      <el-card header="可视化图表" body-style="{ height: '200px' }">-->
      <!--        <div v-loading="submitting" style="height: 400px">-->
      <!--          <ECharts ref="chart" :option="chartOption" />-->
      <!--        </div>-->
      <!--      </el-card>-->
      <!--    </el-col>-->
    </el-row>
  </div>
</template>
