<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Receipt",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getTaskListByCriteria , submitReceipt } from "@/api/submanage";
import { getAllPostman } from "@/api/postman";
import { getUUID } from "@/api/util"

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { TaskPageVO, TaskQuery, TaskType , ReceiptParams} from "@/api/submanage/types";
import { PostmanForm, PostmanQuery } from "@/api/postman/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";
import { registerVisual } from "echarts";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

// 表格显示的数据
const taskList = ref<TaskPageVO[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
});

// 查询需要的数据
const queryParams = reactive<TaskQuery>({
  pageNum: 1,
  pageSize: 10,
  substation: "",
  taskStatus: "",
  taskType: "",
  startLine: "",
  endLine: "",
  postman: "",
});

// 回执详细信息相关数据

var receiptParams = reactive<ReceiptParams>({})

var postmanList = ref<PostmanForm[]>([]);

const queryPostmans = reactive<PostmanQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 下拉栏所需要的数据
var taskTypeList = ref<any[]>([]);

// 新建相关格式要求设置
const rules = reactive({
  name: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  loading.value = true;
  getTaskListByCriteria(queryParams)
    .then(({ data }) => {
      taskList.value = data.list;
      total.value = data.total;
      dropDownBarDataRefresh();
      console.log("打印加载到的所有任务类型");
      console.log(taskTypeList);
      console.log("打印加载到的所有任务类型结束");
    })
    .finally(() => {
      loading.value = false;
    });
}

// 查询所有可用配送人员
function allPostman() {
  getAllPostman(queryPostmans).then(({ data }) => {
    postmanList.value = data.list;
  });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.substation = "";
  queryParams.taskStatus = "";
  queryParams.taskType = "";
  queryParams.startLine = "";
  queryParams.endLine = "";
  queryParams.postman = "";
  handleQuery();
}

/**
 * 选中任务单
 */
 function selectTask(row: { [key: string]: any }) {
  receiptParams.id = row.id;
  receiptParams.substation = row.substation;
  receiptParams.taskType = row.taskType;
  receiptParams.taskDate = row.taskDate;
  receiptParams.customerName = row.customerName;
  receiptParams.customerAddress = row.customerAddress;
  receiptParams.customerPhone = row.mobilePhone;
  receiptParams.goodSum = row.goodSum;
  receiptParams.receiveName = row.receiveName;
  receiptParams.address = row.address;
  receiptParams.postman = row.postman;
  receiptParams.endDate = row.endDate;
  receiptParams.receiptId = row.receiptId;
  receiptParams.replyClass = row.taskType;
  receiptParams.taskStatus = row.taskStatus;
  getUUID().then(({data}) => {
    receiptParams.receiptId = data;
  })
}

/**
 * 加载下拉栏所需要的数据
 */
function dropDownBarDataRefresh() {
  console.log("进入下拉栏数据加载方法");
  console.log(taskList.value.length);

  for (var i = 0; i < taskList.value.length; i++) {
    var ex = false;

    for (var j = 0; j < taskTypeList.value?.length; j++) {
      console.log(i);
      console.log(taskList.value.at(i)?.taskType);
      console.log(taskTypeList.value.at(j));
      if (taskList.value.at(i)?.taskType == taskTypeList.value.at(j)) {
        ex = true;
        break;
      }
    }

    if (!ex) {
      taskTypeList.value.push(taskList.value.at(i)?.taskType);
      continue;
    }
  }
}

/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 提交回执
 */
function sendReceipt(){
    submitReceipt(receiptParams);
}

/**
 * 清空回执
 */
function clearReceipt(){
  receiptParams.id = undefined;
  receiptParams.substation = undefined;
  receiptParams.taskType = undefined;
  receiptParams.taskDate = undefined;
  receiptParams.customerName = undefined;
  receiptParams.customerAddress = undefined;
  receiptParams.customerPhone = undefined;
  receiptParams.goodSum = undefined;
  receiptParams.receiveName = undefined;
  receiptParams.address = undefined;
  receiptParams.postman = undefined;
  receiptParams.endDate = undefined;
  receiptParams.receiptId = undefined;
  receiptParams.replyClass = undefined;
  receiptParams.taskStatus = undefined;
}

onMounted(() => {
  queryParams.taskStatus = "已领货"
  handleQuery();
  allPostman();
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="配送人员" prop="name">
          <el-select v-model="queryParams.postman" placeholder="全部" clearable>
            <el-option
              v-for="item in postmanList"
              :key="item.postmanName"
              :label="item.postmanName"
              :value="item.postmanName"
            >
            </el-option>
          </el-select>
          <!-- <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item> -->
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select
            v-model="queryParams.taskType"
            placeholder="全部"
            clearable
          >
            <el-option
              v-for="item in taskTypeList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间界限：">
          <el-date-picker
            v-model="queryParams.startLine"
            value-format="YYYY-MM-DD"
            placeholder="时间左界限"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryParams.endLine"
            value-format="YYYY-MM-DD"
            placeholder="时间右界限"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
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
    <!-- 回执单详细信息录入栏 -->
    <el-card>
      <el-form ref="queryFormRef" :model="receiptParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="任务单号" prop="id" style="width: 300px;">
          <el-input
            v-model="receiptParams.id"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分站名称" prop="substation" style="width: 300px;">
          <el-input
            v-model="receiptParams.substation"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType" style="width: 300px;">
          <el-input
            v-model="receiptParams.taskType"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务日期" prop="taskDate" style="width: 300px;">
          <el-input
            v-model="receiptParams.taskDate"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerName"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户地址" prop="customerAddress" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerAddress"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerPhone"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="订单总额" prop="goodSum" style="width: 300px;">
          <el-input
            v-model="receiptParams.goodSum"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="接收人名" prop="receiveName" style="width: 300px;">
          <el-input
            v-model="receiptParams.receiveName"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="送货地址" prop="address" style="width: 300px;">
          <el-input
            v-model="receiptParams.address"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="配送人员" prop="postman" style="width: 300px;">
          <el-input
            v-model="receiptParams.postman"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="送到日期" prop="endDate" style="width: 300px;">
          <el-input
            v-model="receiptParams.endDate"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="签收单号" prop="receiptId" style="width: 300px;">
          <el-input
            v-model="receiptParams.receiptId"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户签名" prop="sign" style="width: 300px;">
          <el-input
            v-model="receiptParams.sign"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户反馈" prop="customerSatis">
          <el-input
            v-model="receiptParams.customerSatis"
            placeholder="请输入0—100的评分"
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="sendReceipt()"
            ><i-ep-search />提交回执</el-button
          >
          <el-button @click="clearReceipt()"><i-ep-refresh />清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 任务单表单信息 -->
    <el-card shadow="never">
      <!-- 表单上方按钮栏 -->
      <!-- <template #header>
        <el-button
          v-hasPerm="['sys:dict_type:add']"
          type="success"
          @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
          ><i-ep-delete />删除</el-button
        >
      </template> -->
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
        :data="taskList"
        border
        style="width: 100%;"
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
          key="id"
          label="任务单号"
          align="center"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="postman"
          label="配送人员"
          align="center"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="customerName"
          label="客户姓名"
          align="center"
          prop="customerName"
          min-width="12%"
        />
        <el-table-column
          key="mobilePhone"
          label="客户电话"
          align="center"
          prop="mobilePhone"
          min-width="12%"
        />
        <el-table-column
          key="goodSum"
          label="商品总价值"
          align="center"
          prop="goodSum"
          min-width="12%"
        />
        <el-table-column
          key="taskType"
          label="任务类型"
          align="center"
          prop="taskType"
          min-width="12%"
        />
        <el-table-column
          key="address"
          label="投递地址"
          align="center"
          prop="address"
          min-width="12%"
        />
        <el-table-column label="" fixed="right" align="center" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:user:reset_pwd']"
                  type="primary"
                  size="small"
                  link
                  @click="selectTask(scope.row)"
                  
                  ><i-ep-edit />选择</el-button
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
