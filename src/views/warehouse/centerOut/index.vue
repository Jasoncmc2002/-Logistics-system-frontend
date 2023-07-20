<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "CenterIn",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getBuyListByCriteria , submitCenterIn , getAllocationByCriteria , getDetailsByOrderId , submitCenterOut } from "@/api/warehouse";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { AllocationQuery , AllocationPageVO , InOutStation , DetailPageVO , DetailQuery, CenterOutData } from "@/api/warehouse/types";
import { number } from "echarts";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const detailLoading = ref(false);
const detailTotal = ref(0);

// 查询参数
const queryParams = reactive<AllocationQuery>({
  pageNum: 1,
  pageSize: 10, 
  endTime: new Date(2100, 10, 10, 10, 10),
  startTime: new Date(2000, 10, 10, 10, 10),  
  alloType: 1,
  id: ""
});

const detailParams = reactive<DetailQuery>({
  pageNum: 1,
  pageSize: 10,
  orderId: undefined
})

// 提交出库所需要的数据
const centerOutData = reactive<CenterOutData>({})

const inOutStation = reactive<InOutStation>({})

// 表格显示的数据
const allocationList = ref<AllocationPageVO[]>([]);
const detailList = ref<DetailPageVO[]>([]);

// 声明一个待用弹窗，初始为不可见
const dialog = reactive<DialogOption>({
  visible: false,
});

// 声明一个待用弹窗，初始为不可见，用于提交出库
const centerOutDialog = reactive<DialogOption>({
  visible: false,
});


// 新建相关格式要求设置
const rules = reactive({
  distributor: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  signer: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
  remark: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
  date: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  loading.value = true;
  // getBuyListByCriteria(queryParams)
  //   .then(({ data }) => {
  //     loading.value = true;
  //     buyList.value = data.list;
  //     total.value = data.total;
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   })
  getAllocationByCriteria(queryParams)
    .then(({ data }) => {
      loading.value = true;
      allocationList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    })
}

/**
 * 获取所有详细数据
 */
 function getDetails(orderId: number) {
  detailParams.orderId = orderId;
  detailLoading.value = true;
  getDetailsByOrderId(detailParams)
    .then(({ data }) => {
      detailLoading.value = true;
      detailList.value = data.list;
      detailTotal.value = data.total;
    })
    .finally(() => {
      detailLoading.value = false;
    })
}

/**
 * 关闭弹窗
 */
 function closeDialog() {
  dialog.visible = false;
}

/**
 * 关闭弹窗
 */
 function closeCenterOutDialog() {
  centerOutDialog.visible = false;
}

/**
 * 提交出库
 */
function showCenterOut(row: { [key: string]: any }){
  centerOutData.alloId = row.id;
  centerOutData.orderId = row.orderId;
  detailParams.orderId = row.orderId;
  getDetailsByOrderId(detailParams)
    .then(({data}) =>{
      centerOutData.goods = data.list;
      centerOutDialog.title = "确认调拨单 [ "+row.id+" ]出库信息";
      centerOutDialog.visible = true;
    })
    .finally()
}

/**
 * 提交出库
 */
function centerOut(){
  if(centerOutData.distributor == undefined || centerOutData.signer == undefined || centerOutData.date == undefined || centerOutData.remark == undefined ||centerOutData.distributor == "" || centerOutData.signer == "" || centerOutData.date == "" || centerOutData.remark == ""){
    ElMessage.warning("数据填写不完全!");
    return;
  }
  submitCenterOut(centerOutData)
  .then(({data}) => {
    closeCenterOutDialog();
    ElMessage.success("中心库房调拨出库成功!");
    handleQuery();
  });
}


/**
 * 查看调拨单详情
 */
 function showDetails(row: { [key: string]: any }) {

  getDetails(row.orderId);
  dialog.visible = true;
  
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
  submitCenterIn(inOutStation);
  clearCenterIn();
}

function clearCenterIn(){
  inOutStation.goodId = undefined;
  inOutStation.goodName = undefined;
  inOutStation.date = undefined;
  inOutStation.buyDate = undefined;
  inOutStation.number = undefined;
  inOutStation.remark = undefined;
  inOutStation.signer = undefined;
  inOutStation.supply = undefined;
}

function selectBuy(row: { [key: string]: any }){
  inOutStation.goodId = row.centralGoodId;
  inOutStation.supply = row.supply;
  inOutStation.buyDate = row.buyDate;
}

function actualNumber(row: { [key: string]: any }){
  inOutStation.number = parseFloat(row.number);
}

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
            ><i-ep-search />搜索</el-button>
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
        :data="allocationList"
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
        <el-table-column
          key="allocationDate"
          label="出库日期"
          align="center"
          prop="allocationDate"
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
              @click="showCenterOut(scope.row)"
              min-width="12%"
              ><i-ep-edit />出库</el-button
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
      width="600px"
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
        v-loading="detailLoading"
        highlight-current-row
        :data="detailList"
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
        v-model:total="detailTotal"
        v-model:page="detailParams.pageNum"
        v-model:limit="detailParams.pageSize"
        @pagination="getDetails(detailParams.orderId?detailParams.orderId:1)"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="centerOutDialog.visible"
      :title="centerOutDialog.title"
      width="400px"
      append-to-body
      @close="closeCenterOutDialog"
    >
      <el-form
          ref="userFormRef"
          :model="centerOutData"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="分发人" prop="distributor" style="width: 300px;">
          <el-input
            v-model="centerOutData.distributor"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="签收人" prop="signer" style="width: 300px;">
          <el-input
            v-model="centerOutData.signer"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 300px;">
          <el-input
            v-model="centerOutData.remark"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="分发日期" prop="date" style="width: 300px;">
          <el-date-picker
            v-model="centerOutData.date"
            placeholder="分发日期"
            clearable
            style="width: 500px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="centerOut">出 库</el-button>
          <el-button @click="closeCenterOutDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>



  </div>
</template>
