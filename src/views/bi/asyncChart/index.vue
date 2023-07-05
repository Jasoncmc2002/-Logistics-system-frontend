<script setup lang="ts">
import {
  BiResponse,
  ChartAddRequest,
  genChartByAiUsingPOSTParams,
} from "@/api/bi/types";
import { reactive } from "vue";
import { getSupplyMoney } from "@/api/financial/supply";
import { genChartByAiAsyncUsingPOST, genChartByAiUsingPOST } from "@/api/bi";
import type {
  UploadProps,
  UploadUserFile,
  UploadRawFile,
  UploadFile,
  FormInstance,
  Action,
} from "element-plus";
import { UploadInstance } from "element-plus";

const queryFormRef = ref(ElForm); // 查询表单
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
const upload = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>();
const submitting = ref(false);
let chartOption = ref();
const res = reactive<BiResponse>({
  chartId: 0,
  genChart: "",
  genResult: "",
});
const formRules = reactive({
  goal: [{ required: true, message: "请输入分析目标" }],
});

function reset() {
  queryFormRef.value.resetFields();
}

function submit(option) {
  submitting.value = true;
  genChartByAiAsyncUsingPOST(option.file, <genChartByAiUsingPOSTParams>formData)
    .then(({ data }) => {
      console.warn(data);
      if (data.genChart == null) {
        ElMessage.warning("分析失败");
      } else {
        res.chartId = data.chartId;
        res.genChart = data.genChart;
        res.genResult = data.genResult;
        chartOption = JSON.parse(data.genChart);
        if (!chartOption) {
          ElMessage.warning("图表代码解析错误");
        }
      }
    })
    .finally(() => {
      submitting.value = false;
    });
}
function submitload() {
  upload.value.submit();
}
</script>

<template>
  <div class="add-chart">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card header="智能分析">
          <el-form
            ref="queryFormRef"
            :model="formData"
            label-position="left"
            label-width="120px"
            :rules="formRules"
            :initialValues="{}"
          >
            <el-form-item label="分析目标" :rules="formRules.goal">
              <el-input
                type="textarea"
                placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"
                v-model="formData.goal"
              ></el-input>
            </el-form-item>
            <el-form-item label="图表名称">
              <el-input
                placeholder="请输入图表名称"
                v-model="formData.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="图表类型">
              <el-select v-model="formData.chartType">
                <el-option
                  v-for="option in chartTypes"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原始数据">
              <el-upload
                ref="upload"
                name="file"
                action=""
                :http-request="submit"
                :auto-upload="false"
                :file-list="fileList"
                limit="1"
              >
                <el-button slot="trigger" type="primary">
                  <i class="el-icon-upload"></i> 上传 CSV 文件
                </el-button>
              </el-upload>
            </el-form-item>

            <el-form-item :wrapper-col="{ span: 16, offset: 4 }">
              <el-space>
                <el-button
                  type="primary"
                  :loading="submitting"
                  :disabled="submitting"
                  @click="submitload"
                >
                  提交
                </el-button>
                <el-button @click="reset">重置</el-button>
              </el-space>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
