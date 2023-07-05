<template>
  <div class="my-chart-page">
    <div>
      <el-input
        placeholder="请输入图表名称"
        suffix-icon="el-icon-search"
        :loading="loading"
        @search="handleSearch"
      ></el-input>
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
          <el-avatar
            :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
          ></el-avatar>
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
            <div style="margin-bottom: 16px"></div>
            <div style="height: 400px">
              <ECharts ref="chart" :option="JSON.parse(item.genChart)" />
            </div>
            <!--						<el-echarts-->
            <!--								:options="item.genChart && JSON.parse(item.genChart)"-->
            <!--						></el-echarts>-->
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
      :current-page="searchParams.current"
      :page-sizes="[4, 8, 12]"
      :page-size="searchParams.pageSize"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { listMyChartByPageUsingPOST } from "@/api/bi";

export default {
  setup() {
    const initSearchParams = {
      current: 1,
      pageSize: 4,
      sortField: "createTime",
      sortOrder: "desc",
    };

    const searchParams = reactive({ ...initSearchParams });
    const chartList = ref([]);
    const total = ref(0);
    const loading = ref(true);

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await listMyChartByPageUsingPOST(searchParams);
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
      searchParams.name = value;
      searchParams.current = 1; // Reset current page to 1
      loadData();
    };

    const handlePagination = (page, pageSize) => {
      searchParams.current = page;
      searchParams.pageSize = pageSize;
      loadData();
    };

    onMounted(() => {
      loadData();
    });

    return {
      searchParams,
      chartList,
      total,
      loading,
      handleSearch,
      handlePagination,
    };
  },
};
</script>

<style scoped>
.my-chart-page {
  margin: 16px;
}

.margin-16 {
  margin-bottom: 16px;
}
</style>
