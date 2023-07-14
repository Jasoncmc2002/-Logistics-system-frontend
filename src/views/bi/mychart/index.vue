<script>
import {onMounted, reactive, ref} from "vue";
import {listMyChartByPageUsingPOST} from "@/api/bi";

export default {
  setup() {
    const initSearchParams = {
      current: 1,
      pageSize: 4,
      chartName: "",
      chartType: "",
      chartStatus: "",
      sortField: "createTime",
      sortOrder: "desc",
    };
    const chartTypes = [
      { value: "折线图", label: "折线图" },
      { value: "柱状图", label: "柱状图" },
      { value: "堆叠图", label: "堆叠图" },
      { value: "饼图", label: "饼图" },
      { value: "雷达图", label: "雷达图" },
    ];
    const options = [
      {
        value: "",
        label: "全部",
      },
      {
        value: "succeed",
        label: "成功生成",
      },
      {
        value: "failed",
        label: "生成失败",
      },
      {
        value: "running",
        label: "生成中",
      },
      {
        value: "wait",
        label: "等待",
      },
    ];
    const queryFormRef = ref(ElForm); // 查询表单
    const queryParams = reactive({ ...initSearchParams });
    const chartList = ref([]);
    const total = ref(0);
    const loading = ref(true);

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await listMyChartByPageUsingPOST(queryParams);
        if (res.data) {
          chartList.value = res.data.records ?? [];
          total.value = res.data.total ?? 0;
          // 隐藏图表的 title
          if (res.data.records) {
            res.data.records.forEach((data) => {
              if (data.chartStatus === "succeed") {
                const chartOption = JSON.parse(data.genChart ?? "{}");
                chartOption.title = undefined;
                data.genChart = JSON.stringify(chartOption);
              }
            });
          } else {
            message.error("获取我的图表失败");
          }
        }
      } catch (e) {
        message.error("获取我的图表失败，" + e.message);
      }
      loading.value = false;
    };
    const handleSearch = (value) => {
      // 设置搜索条件
      queryParams.name = value;
      queryParams.current = 1; // Reset current page to 1
      loadData();
    };

    const handlePagination = (page, pageSize) => {
      queryParams.current = page;
      queryParams.pageSize = pageSize;
      loadData();
    };

    onMounted(() => {
      loadData();
    });
    function resetQuery() {
      queryParams.name = "";
      queryParams.chartName = "";
      queryParams.chartType = "";
      queryFormRef.value.resetFields();
    }
    return {
      queryFormRef,
      resetQuery,
      chartTypes,
      options,
      queryParams,
      chartList,
      total,
      loading,
      handleSearch,
      handlePagination,
    };
  },
};
</script>

<template>
  <div class="my-chart-page">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="图表名称">
          <el-input
            v-model="queryParams.chartName"
            placeholder="请输入图表名称（支持模糊搜索）"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="选择请图表类型">
          <el-select
            v-model="queryParams.chartType"
            class="m-2"
            placeholder="Select"
          >
            <el-option
              v-for="item in chartTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择请图表状态">
          <el-select
            v-model="queryParams.chartStatus"
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
          <el-button type="primary" @click="handleSearch"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery">
            <i-ep-refresh />
            重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="margin-16" />
    <el-row :gutter="16">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        :xxl="12"
        v-for="item in chartList"
        :key="item.id"
      >
        <el-card>
          <div>
            <h3>{{ item.chartName }}</h3>
            <p v-if="item.chartType">图表类型：{{ item.chartType }}</p>
          </div>
          <template v-if="item.chartStatus === 'wait'">
            <el-result
              status="warning"
              title="待生成"
              :subTitle="item.execMessage || '当前图表生成队列繁忙，请耐心等候'"
            ></el-result>
          </template>
          <template v-if="item.chartStatus === 'running'">
            <el-result
              status="info"
              title="图表生成中"
              :subTitle="item.execMessage"
            ></el-result>
          </template>
          <template v-if="item.chartStatus === 'succeed'">
            <div style="margin-bottom: 16px"></div>

            <p>{{ "分析目标：" + item.goal }}</p>
						<el-card header="分析结论">
							<div>{{ item.genResult }}</div>
						</el-card>
            <div style="margin-bottom: 16px"></div>

            <div style="height: 400px">
              <ECharts ref="chart" :option="JSON.parse(item.genChart)" />
            </div>
          </template>
          <template v-if="item.chartStatus === 'failed'">
            <el-result
              status="error"
              title="图表生成失败"
              :subTitle="item.execMessage"
            ></el-result>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handlePagination"
      @current-change="handlePagination"
      :current-page="queryParams.current"
      :page-sizes="[4, 8, 12]"
      :page-size="queryParams.pageSize"
      :total="total"
    ></el-pagination>
  </div>
</template>
