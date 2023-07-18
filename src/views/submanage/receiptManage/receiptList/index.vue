<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Receipt",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getReceiptListByCriteria , submitReceipt , getGoodDetailAPI , getOrderIdByTaskId } from "@/api/submanage/receiptList";
import { getAllPostman } from "@/api/postman";
import { getUUID } from "@/api/util"

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { TaskType , ReceiptParams , GoodPaageVO , GoodQuery , ReceiptQuery , ReceiptPageVO , TaskId } from "@/api/submanage/receiptList/types";
import { PostmanForm, PostmanQuery } from "@/api/postman/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { constant, forEach } from "lodash";
import { registerVisual } from "echarts";
////////////////////////////////////////////////////////////////////////////////////////////////////////////---声明前端固定使用的数据---///////////////////////////////////////////////////////////////////////////////

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const goodLoading = ref(false);
const goodTotal = ref(0);

///////////////////////---弹窗--//////////////////////////

const dialog = reactive<DialogOption>({
  visible: false,
});

const goodDialog = reactive<DialogOption>({
  visible: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////
// 查询需要的数据
const queryParams = reactive<ReceiptQuery>({
  pageNum: 1,
  pageSize: 10,
  taskType: "",
  startLine: "",
  endLine: "",
});

// 查询每个任务单对应商品详情时使用的查询参数
const goodQuery = reactive<GoodQuery>({
  pageNum: 1,
  pageSize: 10
})

///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const receiptList = ref<ReceiptPageVO[]>([]);

// 下拉栏所需要的数据
var taskTypeList = ref<any[]>([]);

// 显示详情弹窗需要的数据
const goodList = ref<GoodPaageVO[]>([])

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
  getReceiptListByCriteria(queryParams)
    .then(({ data }) => {
      receiptList.value = data.list;
      total.value = data.total;
      dropDownBarDataRefresh();
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
  queryParams.taskType = "";
  queryParams.startLine = "";
  queryParams.endLine = "";
  handleQuery();
}

/**
 * 加载下拉栏所需要的数据
 */
 function dropDownBarDataRefresh() {
  console.log("进入下拉栏数据加载方法");
  console.log(receiptList.value.length);

  for (var i = 0; i < receiptList.value.length; i++) {
    var ex = false;

    for (var j = 0; j < taskTypeList.value?.length; j++) {
      if (receiptList.value.at(i)?.taskType == taskTypeList.value.at(j)) {
        ex = true;
        break;
      }
    }

    if (!ex) {
      taskTypeList.value.push(receiptList.value.at(i)?.taskType);
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
 * 显示详情
 */
function showDetail(row: { [key: string]: any }){
  const tid = reactive<TaskId>({});
  tid.taskId = row.taskId;
  getOrderIdByTaskId(tid)
    .then(({ data }) => {
      goodQuery.orderId = data;
      console.log(goodQuery.orderId);
      getGoodDetail();
    })
  
}
///////////////////////---弹窗事件---//////////////////////////
function closeGoodDialog(){
  goodDialog.visible = false;
}
///////////////////////---挂载时自动渲染---//////////////////////////

onMounted(() => {
  handleQuery();
});

</script>

<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
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
        :data="receiptList"
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
          label="回执单号"
          align="center"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="customerName"
          label="客户名称"
          align="customerName"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="mobilephone"
          label="客户电话"
          align="center"
          prop="mobilephone"
          min-width="12%"
        />
        <el-table-column
          key="substation"
          label="处理分站"
          align="center"
          prop="substation"
          min-width="12%"
        />
        <el-table-column
          key="price"
          label="商品总价值"
          align="center"
          prop="price"
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
        <el-table-column
          key="customerSatis"
          label="客户满意度"
          align="center"
          prop="customerSatis"
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
