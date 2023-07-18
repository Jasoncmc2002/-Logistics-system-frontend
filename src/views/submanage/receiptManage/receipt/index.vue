<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Receipt",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getTaskListByCriteria , submitReceipt , getGoodDetailAPI } from "@/api/submanage/receipt";
import { getAllPostman } from "@/api/postman";
import { getUUID } from "@/api/util"

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { TaskPageVO, TaskQuery, TaskType , ReceiptParams , GoodPaageVO , GoodQuery } from "@/api/submanage/receipt/types";
import { PostmanForm, PostmanQuery } from "@/api/postman/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
////////////////////////////////////////////////////////////////////////////////////////////////////////////---声明前端固定使用的数据---///////////////////////////////////////////////////////////////////////////////

const queryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const goodLoading = ref(false);
const goodTotal = ref(0);

///////////////////////---弹窗--//////////////////////////
const goodDialog = reactive<DialogOption>({
  visible: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////
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

// 查询所有快递员的query参数
const queryPostmans = reactive<PostmanQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 查询每个任务单对应商品详情时使用的查询参数
const goodQuery = reactive<GoodQuery>({
  pageNum: 1,
  pageSize: 10
})

///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const taskList = ref<TaskPageVO[]>([]);

// 用于下拉框展示可供选择的所有快递员
var postmanList = ref<PostmanForm[]>([]);

// 下拉栏所需要的数据
var taskTypeList = ref<any[]>([]);

// 显示详情弹窗需要的数据
const goodList = ref<GoodPaageVO[]>([])

///////////////////////---格式要求设置---//////////////////////////

// 新建相关格式要求设置
const rules = reactive({
  id: [{ required: true, message: "任务单号不得为空，请选择任务", trigger: "blur" }],
  sign: [{ required: true, message: "请输入您的名字", trigger: "blur" }],
  remark: [{ required: true, message: "请输入您的评价", trigger: "blur" }],
  customerSatis: [{ required: true, message: "满分100分，在满意程度方面，您能打几分", trigger: "blur" , pattern: /([1-9]|[1-9][0-9]|100)/ }],
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---方法---///////////////////////////////////////////////////////////////////////////////
///////////////////////---加载数据---//////////////////////////
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
 * 加载下拉栏所需要的数据
 */
 function dropDownBarDataRefresh() {
  for (var i = 0; i < taskList.value.length; i++) {
    var ex = false;

    for (var j = 0; j < taskTypeList.value?.length; j++) {
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
 * 加载对应任务的商品详情
 */
function getGoodDetail() {
  getGoodDetailAPI(goodQuery).then(({ data }) => {
    goodList.value = data.list;
    goodDialog.title = "任务单详情",
    goodDialog.visible = true;
  });
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
 * 显示详情
 */
function showDetail(row: { [key: string]: any }){
  goodQuery.orderId = row.orderId;
  getGoodDetail();
}
///////////////////////---弹窗事件---//////////////////////////
function closeGoodDialog(){
  goodDialog.visible = false;
}
///////////////////////---挂载时自动渲染---//////////////////////////

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
            placeholder="时间左界限"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryParams.endLine"
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
      <el-form ref="queryFormRef" :model="receiptParams" :inline="true" :rules="rules">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="任务单号" prop="id" style="width: 300px;">
          <el-input
            v-model="receiptParams.id"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分站名称" prop="substation" style="width: 300px;">
          <el-input
            v-model="receiptParams.substation"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType" style="width: 300px;">
          <el-input
            v-model="receiptParams.taskType"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务日期" prop="taskDate" style="width: 300px;">
          <el-input
            v-model="receiptParams.taskDate"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerName"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户地址" prop="customerAddress" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerAddress"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone" style="width: 300px;">
          <el-input
            v-model="receiptParams.customerPhone"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="订单总额" prop="goodSum" style="width: 300px;">
          <el-input
            v-model="receiptParams.goodSum"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="接收人名" prop="receiveName" style="width: 300px;">
          <el-input
            v-model="receiptParams.receiveName"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="送货地址" prop="address" style="width: 300px;">
          <el-input
            v-model="receiptParams.address"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="配送人员" prop="postman" style="width: 300px;">
          <el-input
            v-model="receiptParams.postman"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="送到日期" prop="endDate" style="width: 300px;">
          <el-input
            v-model="receiptParams.endDate"
            placeholder=""
            readonly="true"
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="签收单号" prop="receiptId" style="width: 300px;">
          <el-input
            v-model="receiptParams.receiptId"
            placeholder=""
            readonly="true"
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
        <el-form-item label="客户评价" prop="remark">
          <el-input
            v-model="receiptParams.remark"
            placeholder="请输入你的感受"
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
                  type="primary"
                  size="small"
                  link
                  @click="showDetail(scope.row)"
                  
                  ><i-ep-edit />显示详情</el-button
                >
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


    <!-- 表单弹窗 -->
    <el-dialog
      v-model="goodDialog.visible"
      :title="goodDialog.title"
      width="600px"
      append-to-body
      @close="closeGoodDialog"
    >
      <!-- 表单开始位置 -->
      <!-- 
        v-loading = 是否加载完成表单
        :data = 动态绑定榜单数据
        border = 展示的表格带有边框
        @selection-change = 绑定多选时触发的函数
       -->
       <el-table
        v-loading="goodLoading"
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
          key="goodNumber"
          label="出库数量"
          align="center"
          prop="goodNumber"
          min-width="12%"
        />
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
        v-model:total="goodTotal"
        v-model:page="goodQuery.pageNum"
        v-model:limit="goodQuery.pageSize"
        @pagination="getGoodDetail()"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeGoodDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>
