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
import { getReceiptPage } from "@/api/receipt/index";
import { values } from "lodash";

const firstCategoryFormRef = ref(ElForm);

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
const userList1 = ref<ReceiptPageVO[]>();
const userList2 = ref(null);
const total1 = reactive({
  number: 0,
});
const total2 = reactive({
  number: 0,
});
const total3 = reactive({
  number: 0,
});
const formData1 = reactive<ReceiptForm>({});

const rules = reactive({
  name: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

const options = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    top: "bottom",
    textStyle: {
      color: "#999",
    },
  },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [50, 130],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 1,
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
          return colorList[params.dataIndex];
        },
      },
      // data: userList2.value,
      data: [
        { value: total1.number, name: "满意" },
        { value: total2.number, name: "不满意" },
        { value: total3.number, name: "其他" },
      ],
    },
  ],
};

async function handleQuery1() {
  loading.value = true;
  await getReceiptPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
      for (var i = 0; i < userList1.value.length; i++) {
        if (userList1.value[i].customerSatis == "满意") {
          total1.number = total1.number + 1;
        } else {
          if (userList1.value[i].customerSatis == "不满意") {
            total2.number = total2.number + 1;
          } else {
            total3.number = total3.number + 1;
          }
        }
      }

      userList2.value = [
        { value: total1.number, name: "满意" },
        { value: total2.number, name: "不满意" },
        { value: total3.number, name: "其他" },
      ];
      console.log(userList2.value);
    })

    .finally(() => {
      loading.value = false;
    });
}
// watch: {
// 	seriesData(val) {
// 		this.setOptions({series:val})
// 	}
// }

function resetQuery1() {
  // firstCategoryFormRef.value.resetFields();

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

const props = defineProps({
  id: {
    type: String,
    default: "pieChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500px",
    required: true,
  },
  height: {
    type: String,
    default: "500px",
    required: true,
  },
});

onMounted(() => {
  handleQuery1();

  console.log(options.series[0].data);
  const chart = echarts.init(
    document.getElementById(<string>props.id) as HTMLDivElement
  );
  chart.setOption(options);
  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 搜索栏 -->
      <el-col :span="12">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            <el-form-item>
              <el-button @click="resetQuery1">
                <i-ep-refresh />
                重置</el-button
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
            <!--            <el-table-column type="selection" width="100" />-->
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
          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams1.pageNum"
            v-model:limit="queryParams1.pageSize"
            @pagination="handleQuery1"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <div :id="id" :class="className" :style="{ height, width }" />
      </el-col>
    </el-row>
  </div>
</template>
