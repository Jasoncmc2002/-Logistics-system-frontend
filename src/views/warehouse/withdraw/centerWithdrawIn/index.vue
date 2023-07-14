<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "CenterWithdrawIn",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////
// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getAlloListByKey , submitCenterIn , getGoodListByAlloId , centerInDataSubmit } from "@/api/withdraw/centerWithdrawIn";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { AlloQuery , GoodPageVO , ReceiveData, ReceiveQueryResult , SubmitReceiveData , AllocationPageVO , GoodQuery , SubOutData } from "@/api/withdraw/subWithdraw/types";
import { all } from "axios";

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
const dialogLoading = ref(false);
// ids：存放多选时的id
const ids = ref<number[]>([]);
// total：决定表单对应数据的总数
const total = ref(0);
const dialogTotal = ref(0);

///////////////////////---弹窗--//////////////////////////

// 声明一个待用弹窗，初始为不可见： 用于显示调度单详情
const dialog = reactive<DialogOption>({
  visible: false,
});

// 声明一个待用弹窗，初始为不可见： 用于提交分站库房出库信息
const submitDialog = reactive<DialogOption>({
  visible: false,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////

// 查询参数
const queryParams = reactive<AlloQuery>({
  pageNum: 1,
  pageSize: 10,
  id: "",
  alloType: 6,
  endTime: new Date(2023, 10, 10, 10, 10),
  startTime: new Date(2021, 10, 11, 10, 10),
});

// 查询商品详情时使用的参数
const dialogQueryParams = reactive<GoodQuery>({
  pageNum: 1,
  pageSize: 10,
})

// 提交领货信息的数据体
const submitReceiveData = reactive<SubmitReceiveData>({});

///////////////////////---用于请求的数据---//////////////////////////

const subOutData = reactive<SubOutData>({})

///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const alloList = ref<AllocationPageVO[]>([]);

// 详情弹窗中，商品详情表单数据
const goodList = ref<GoodPageVO[]>([]);

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
  getAlloListByKey(queryParams)
    .then(({ data }) => {
      loading.value = true;
      alloList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    })
}

function handleGoodsQuery(){
  dialogLoading.value = true;
  getGoodListByAlloId(dialogQueryParams)
    .then(({ data }) => {
      dialogLoading.value = true;
      goodList.value = data.list;
      dialogTotal.value = data.total;
      dialog.title = "调拨单商品详情";
      dialog.visible = true;
    })
    .finally(() => {
      dialogLoading.value = false;
    })
}

// 用于提交时获取相关货物信息
function handleGoodsQueryForSubOut(){
  dialogLoading.value = true;
  getGoodListByAlloId(dialogQueryParams)
    .then(({ data }) => {
      subOutData.goods= data.list;
      submitDialog.title = "填写出库信息";
      submitDialog.visible = true;
    })
    .finally(() => {
      dialogLoading.value = false;
    })
}


/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.id = undefined;
  alloList.value = undefined;
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
 * 确认出库
 */
function subOut(row: { [key: string]: any }){
  subOutData.alloId = row.id;
  dialogQueryParams.id = row.id;
  submitDialog.visible = true;
  handleGoodsQueryForSubOut();
}

/**
 * 查看调拨单详情
 */
function showDetails(row: { [key: string]: any }) {

  dialogQueryParams.id = row.id;
  handleGoodsQuery();

}

///////////////////////---弹窗相关事件---//////////////////////////

/**
 * 提交出库信息，完成分站出库
 */
function subOutSubmit(){
  centerInDataSubmit(subOutData)
    .then(({data}) => {
      closeSubmitDialog();
      handleQuery();
    })
}

/**
 * 关闭弹窗
 */
 function closeDialog() {
  dialog.visible = false;
}

/**
 * 关闭提交弹窗
 */
function closeSubmitDialog() {
  submitDialog.visible = false;
}


///////////////////////---挂载时自动渲染---//////////////////////////

onMounted(() => {
  handleQuery();
});

</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="调拨单号" prop="taskId">
          <el-input
            v-model="queryParams.id"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="时间范围" prop="startLine">
          <el-date-picker
            v-model="queryParams.startTime"
            placeholder="时间左界限"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item label="" prop="endLine">
          <el-date-picker
            v-model="queryParams.endTime"
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
        :data="alloList"
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
          key="id"
          label="调拨单号"
          align="center"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="orderId"
          label="订单号"
          align="center"
          prop="orderId"
          min-width="12%"
        />
        <el-table-column
          key="outStationName"
          label="出库库房"
          align="center"
          prop="outStationName"
          min-width="12%"
        />
        <el-table-column
          key="inStationName"
          label="入库库房"
          align="center"
          prop="inStationName"
          min-width="12%"
        />

        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:user:delete']"
              type="primary"
              link
              size="small"
              @click="showDetails(scope.row)"
              min-width="12%"
              ><i-ep-search />显示详情</el-button
            >
            <el-button
              v-hasPerm="['sys:user:delete']"
              type="primary"
              link
              size="small"
              @click="subOut(scope.row)"
              min-width="12%"
              ><i-ep-edit />分站库房出库</el-button
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
      v-model="dialog.visible"
      :title="dialog.title"
      width="400px"
      append-to-body
      @close="closeDialog"
    >
      <!-- 表单开始位置 -->
      <!-- 
        v-loading = 是否加载完成表单
        :data = 动态绑定榜单数据
        border = 展示的表格带有边框
        @selection-change = 绑定多选时触发的函数
       -->
       <el-table
        v-loading="dialogLoading"
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
          key="goodClass"
          label="商品类型"
          align="center"
          prop="goodClass"
          min-width="12%"
        />
        <el-table-column
          key="goodId"
          label="商品代码"
          align="center"
          prop="goodId"
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
          key="goodUnit"
          label="计量单位"
          align="center"
          prop="goodUnit"
          min-width="12%"
        />
        <el-table-column
          key="goodNumber"
          label="退货数量"
          align="center"
          prop="goodNumber"
          min-width="12%"
        />
      </el-table>
      <!-- 表单结束位置 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">返 回</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 提交分站库房出库表单弹窗 -->
    <el-dialog
      v-model="submitDialog.visible"
      :title="submitDialog.title"
      width="400px"
      append-to-body
      @close="closeSubmitDialog"
    >
    <el-form
          ref="userFormRef"
          :model="subOutData"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="分发人" prop="distributor" style="width: 300px;">
          <el-input
            v-model="subOutData.distributor"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="签收人" prop="signer" style="width: 300px;">
          <el-input
            v-model="subOutData.signer"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 300px;">
          <el-input
            v-model="subOutData.remark"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="分站退货出库日期" prop="date" style="width: 300px;">
          <el-date-picker
            v-model="subOutData.date"
            placeholder="出库日期"
            clearable
            style="width: 500px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="subOutSubmit">出 库</el-button>
          <el-button @click="closeSubmitDialog">返 回</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
