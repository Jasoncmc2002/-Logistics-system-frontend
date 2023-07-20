<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "CenterIn",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getBuyListByCriteria , submitCenterIn} from "@/api/warehouse";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { BuyQuery , BuyPageVO , InOutStation } from "@/api/warehouse/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

// 查询参数
const queryParams = reactive<BuyQuery>({
  pageNum: 1,
  pageSize: 10,
  id:""
});

const inOutStation = reactive<InOutStation>({})

// 表格显示的数据
const buyList = ref<BuyPageVO[]>([]);

// 声明一个待用弹窗，初始为不可见
const dialog = reactive<DialogOption>({
  visible: false,
});


// 新建相关格式要求设置
const rules = reactive({
  signer: [{ required: true, message: "签收人员不得为空", trigger: "blur" }],
  date: [{ required: true, message: "签收日期不得为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不得为空", trigger: "blur" }],
  number: [{ required: true, pattern: /^\d*\.?\d+$/,  message: "请输入大于零的数字", trigger: "blur" }],
});


/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  loading.value = true;
  // getTaskListByCriteria(queryParams)
  //   .then(({ data }) => {
  //     taskList.value = data.list;
  //     total.value = data.total;
  //     dropDownBarDataRefresh();
  //     console.log("打印加载到的所有任务类型");
  //     console.log(taskTypeList);
  //     console.log("打印加载到的所有任务类型结束");
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
  getBuyListByCriteria(queryParams)
    .then(({ data }) => {
      loading.value = true;
      buyList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    })
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.id = undefined;
  handleQuery();
}


/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 提交入库
 */
function centerIn(){
  console.log("实际入库数量" + inOutStation.number + "应该入库数量" + inOutStation.shouldNumber);
  if(inOutStation.number == undefined ||inOutStation.signer == "" || inOutStation.date == "" || inOutStation.remark == "" || inOutStation.signer == undefined || inOutStation.date == undefined || inOutStation.remark == undefined) {
    ElMessage.warning("数据填写不完全");
    return;
  }
  if(inOutStation.number <= inOutStation.shouldNumber){
    ElMessage.warning("实际入库数量不足");
    return;
  }
  submitCenterIn(inOutStation)
    .then(({ data }) => {
      ElMessage.success("中心库房入库成功!");
    })
  clearCenterIn();
  handleQuery();
}

function clearCenterIn(){
  inOutStation.buyId = undefined;
  inOutStation.goodId = undefined;
  inOutStation.goodName = undefined;
  inOutStation.date = undefined;
  inOutStation.buyDate = undefined;
  inOutStation.number = undefined;
  inOutStation.remark = undefined;
  inOutStation.signer = undefined;
  inOutStation.supply = undefined;
  inOutStation.shouldNumber = undefined;
}

function selectBuy(row: { [key: string]: any }){
  inOutStation.buyId = row.buyId;
  inOutStation.goodId = row.centralGoodId;
  inOutStation.supply = row.supply;
  inOutStation.buyDate = row.buyDate;
  inOutStation.shouldNumber = row.buyNumber;
}

function actualNumber(row: { [key: string]: any }){
  inOutStation.number = parseFloat(row.number);
}

onMounted(() => {
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="购货单号" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="如果为空则加载全部"
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 购入单签收详细信息录入栏 -->
    <el-card>
      <el-form ref="queryFormRef" :model="inOutStation" :inline="true" :rules="rules">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        
        <el-form-item label="货物号码" prop="goodId" style="width: 300px;">
          <el-input
            v-model="inOutStation.goodId"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
            readonly="true"
          />
        </el-form-item>
        <el-form-item label="供应商源" prop="supply" style="width: 300px;">
          <el-input
            v-model="inOutStation.supply"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
            readonly="true"
          />
        </el-form-item>
        <el-form-item label="购货日期" prop="buyDate" style="width: 300px;">
          <el-input
            v-model="inOutStation.buyDate"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
            readonly="true"
          />
        </el-form-item>
        <br>
        <el-form-item label="签收人员" prop="signer" style="width: 300px;">
          <el-input
            v-model="inOutStation.signer"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="签收日期" prop="date" style="width: 300px;">
          <el-date-picker
            v-model="inOutStation.date"
            placeholder="购货日期"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" style="width: 300px;">
          <el-input
            v-model="inOutStation.remark"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="实际入库数量" prop="number" style="width: 300px;">
          <el-input
            v-model="inOutStation.number"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <br>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="centerIn()"
            ><i-ep-search />提交进货入库</el-button
          >
          <el-button @click="clearCenterIn()"><i-ep-refresh />清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表单部分 -->
    <el-card shadow="never">
      <!-- 表单开始位置 -->
      <!-- 
        v-loading = 是否加载完成表单
        :data = 动态绑定榜单数据
        border = 展示的表格带有边框
        @selection-change = 绑定多选时触发的函数
       -->
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="buyList"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- 
        设置每一行的数据以及该数据的一些配置：
        key = 没看懂在干什么
        label = 每一列数据的名称
        prop = 对应数据中的成员数据名称
        下方给一个案列
       -->
        <!-- <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            /> -->

        <el-table-column
          key="buyId"
          label="购货单号"
          align="center"
          prop="buyId"
          min-width="12%"
        />
        <el-table-column
          key="goodName"
          label="商品名称"
          align="center"
          prop="goodName"
          min-width="12%"
        />
        <el-table-column
          key="goodClass"
          label="一级类别"
          align="center"
          prop="goodClass"
          min-width="12%"
        />
        <el-table-column
          key="goodSubclass"
          label="二级类别"
          align="center"
          prop="goodSubclass"
          min-width="12%"
        />
        <el-table-column
          key="goodUnit"
          label="商品单位"
          align="center"
          prop="goodUnit"
          min-width="12%"
        />
        <el-table-column
          key="buyNumber"
          label="应入库数量"
          align="center"
          prop="buyNumber"
          min-width="12%"
        />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:user:delete']"
              type="primary"
              link
              size="small"
              @click="selectBuy(scope.row)"
              min-width="12%"
              ><i-ep-delete />选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单结束位置 -->

      <!-- 
        分页配置信息
        total = 表格对应的数据的总数
        page = 表格页数
        limit = 每页表格显示的数据数量
       -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
