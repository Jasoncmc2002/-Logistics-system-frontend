<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Receive",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getGoodListByTaskId , submitCenterIn , submitReceive} from "@/api/warehouse";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { BuyQuery , BuyPageVO , InOutStation, ReceiveQuery, GoodPageVO , ReceiveData, ReceiveQueryResult , SubmitReceiveData } from "@/api/warehouse/types";

// 导入时间选择器等插件
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

////////////////////////////////////////////////////////////////////////////////////////////////////////////---声明前端固定使用的数据---///////////////////////////////////////////////////////////////////////////////

// el-form需要对应的数据格式，里面的内容由model=“所需要的数据”决定
const queryFormRef = ref(ElForm);
// 目前没用到
const dataFormRef = ref(ElForm);
// loading：决定表单是否数据加载成功，是否渲染数据
const loading = ref(false);
// ids：存放多选时的id
const ids = ref<number[]>([]);
// total：决定表单对应数据的总数
const total = ref(0);

///////////////////////---弹窗--//////////////////////////

// 声明一个待用弹窗，初始为不可见
const dialog = reactive<DialogOption>({
  visible: false,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////

// 查询参数
const queryParams = reactive<ReceiveQuery>({
  pageNum: 1,
  pageSize: 10
});

// 提交领货信息的数据体
const submitReceiveData = reactive<SubmitReceiveData>({});

///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const goodList = ref<GoodPageVO[]>([]);

// 填表所需数据
const receiveData = ref<ReceiveData>({});




///////////////////////---格式要求设置---//////////////////////////

// 新建相关格式要求设置
const rules = reactive({
  name: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---方法---///////////////////////////////////////////////////////////////////////////////

///////////////////////---加载数据---//////////////////////////

/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  loading.value = true;
  getGoodListByTaskId(queryParams)
    .then(({ data }) => {
      loading.value = true;
      goodList.value = data.pageInfo?.list;
      receiveData.value = data.task;
      total.value = data.pageInfo?.total;
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
  queryParams.taskId = undefined;
  goodList.value = undefined;
}


///////////////////////---多选事件---//////////////////////////

/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

///////////////////////---按钮事件---//////////////////////////

/**
 * 确认领货
 */
function receiveCommit(){
  submitReceiveData.goods = goodList.value;
  submitReceiveData.taskId = queryParams.taskId;
  submitReceiveData.distributor = receiveData.value.postman;
  submitReceiveData.date = receiveData.value.receiveDate;
  submitReceiveData.stationName = receiveData.value.substation;
  submitReceiveData.stationId = receiveData.value.substationId;
  submitReceive(submitReceiveData);
}

/**
 * 清空领货
 */
function clearReceive(){
  receiveData.value.orderId = undefined;
  receiveData.value.taskDate = undefined;
  receiveData.value.substation = undefined;
  receiveData.value.postman = undefined;
  receiveData.value.taskType = undefined;
  receiveData.value.receiveName = undefined;
  receiveData.value.receiveDate = undefined;
}

///////////////////////---挂载时自动渲染---//////////////////////////

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
        <el-form-item label="任务单号" prop="taskId">
          <el-input
            v-model="queryParams.taskId"
            placeholder=""
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

    <!-- 领货详细信息录入栏 -->
    <el-card>
      <el-form ref="queryFormRef" :model="receiveData" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="订单号" prop="orderId" style="width: 300px;">
          <el-input
            v-model="receiveData.orderId"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务分配日期" prop="taskDate" style="width: 300px;">
          <el-input
            v-model="receiveData.taskDate"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="送货分站" prop="substation" style="width: 300px;">
          <el-input
            v-model="receiveData.substation"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <br>
        <el-form-item label="配送员" prop="postman" style="width: 300px;">
          <el-input
            v-model="receiveData.postman"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType" style="width: 300px;">
          <el-input
            v-model="receiveData.taskType"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="领货人" prop="receiveName" style="width: 300px;">
          <el-input
            v-model="receiveData.receiveName"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="领货日期" prop="receiveDate" style="width: 300px;">
          <el-date-picker
            v-model="receiveData.receiveDate"
            placeholder=""
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
          
        </el-form-item>
        <br>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="receiveCommit()"
            ><i-ep-search />确认领货</el-button
          >
          <el-button @click="clearReceive()"><i-ep-refresh />清空</el-button>
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
        :data="goodList"
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
          key="goodNumber"
          label="应领货数量"
          align="center"
          prop="goodNumber"
          min-width="12%"
        />
        <el-table-column label="实际领货数量" fixed="right" width="220">
              <template #default="scope">
                <el-input 
                v-model="scope.row.number"
                placeholder=""
                clearable
                style="min-width=12%">
                </el-input>
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
