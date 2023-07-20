<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "SubIn",
  inheritAttrs: false,  
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { submitCenterIn , getDetailsByOrderId , getAllocationById , getAllocationDataById , subInSubmit} from "@/api/warehouse";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { InOutStation , DetailPageVO , DetailQuery, AlloQuery , InOutQuery , GoodPageVO , SubInData , AllocationData } from "@/api/warehouse/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";

////////////////////////////////////////////////////////////////////////////////////////////////////////////---声明前端固定使用的数据---///////////////////////////////////////////////////////////////////////////////

// el-form需要对应的数据格式，里面的内容由model=“所需要的数据”决定
const queryFormRef = ref(ElForm);

// 目前没用到
const dataFormRef = ref(ElForm);

// loading：决定表单是否数据加载成功，是否渲染数据
const loading = ref(false);
const detailLoading = ref(false);

// ids：存放多选时的id
const ids = ref<number[]>([]);

// total：决定表单对应数据的总数
const total = ref(0);
const detailTotal = ref(0);

////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////

// 查询参数
const queryParams = reactive<InOutQuery>({
  pageNum: 1,
  pageSize: 10, 
  alloType: 2
});

const alloParams = reactive<AlloQuery>({
  alloType: 2,
})

const detailParams = reactive<DetailQuery>({
  pageNum: 1,
  pageSize: 10,
  orderId: undefined
})

// 提交出库所需要的数据
const subInData = reactive<SubInData>({})


const allocationData = reactive<AllocationData>({})

const inOutStation = reactive<InOutStation>({})

// 表格显示的数据
const goodList = ref<GoodPageVO[]>([]);
const detailList = ref<DetailPageVO[]>([]);

// 声明一个待用弹窗，初始为不可见
const dialog = reactive<DialogOption>({
  visible: false,
});

// 声明一个待用弹窗，初始为不可见，用于提交出库
const subInDialog = reactive<DialogOption>({
  visible: false,
});


// 新建相关格式要求设置
const rules = reactive({
  signer: [{ required: true, message: "请输入签收人姓名", trigger: "blur" }],
  remark: [{ required: true, message: "请输入备注信息", trigger: "blur" }],
  date: [{ required: true, message: "请选择签收日期", trigger: "blur" }],
});

/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  if(queryParams.id == undefined ) {
    ElMessage.warning("请选择要查询的条件");
    return;
  }
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
  getAllocationById(queryParams)
    .then(({ data }) => {
      loading.value = true;
      goodList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
  getAllocationDataById(queryParams)
    .then(({ data }) => {
      allocationData.distributors = data.distributors;
      allocationData.inStationName = data.inStationName;
      allocationData.inStationId = data.inStationId;  
      allocationData.taskId = data.taskId;
    })
    .finally(() => {

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
 function closeSubInDialog() {
  subInDialog.visible = false;
}

/**
 * 提交出库
 */
function showSubIn(){
  if(goodList.value == undefined || goodList.value == null || goodList.value.length == 0){
    ElMessage.warning("请选择你要提交的验货单");
    return;
  }
  for (let i = 0 ; i < goodList.value.length ; i++){
    if(goodList.value.at(i).realNumber == undefined){
      ElMessage.warning("请填写所有商品的实际入库数量!");
      return;
    }
    if(goodList.value.at(i).goodNumber > goodList.value.at(i).realNumber){
      ElMessage.warning("部分商品实际入库数量不足应入库数量!");
      return;
    }
  }
  subInData.stationName = allocationData.inStationName;
  subInData.distributor = allocationData.distributors;
  subInData.goods = goodList.value;
  subInData.alloId = queryParams.id;
  subInData.stationId = allocationData.inStationId;
  subInData.taskId = allocationData.taskId;
  subInDialog.title = "填写入库信息"
  subInDialog.visible = true;
}

/**
 * 提交出库
 */
function subIn(){
  subInSubmit(subInData)
    .then(({data}) => {
      ElMessage.success("分站库房调拨入库成功!");
      return;
    })
  closeSubInDialog();
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
  // handleQuery(); 
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="验货单号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"
            ><i-ep-search />搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showSubIn()"
            ><i-ep-edit />提交入库</el-button>
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
          label="一级分类"
          align="center"
          prop="goodClass"
          min-width="12%"
        />
        <!-- <el-table-column
          key="goodSubClass"
          label="二级分类"
          align="center"
          prop="goodSubClass"
          min-width="12%"
        /> -->
        <el-table-column
          key="goodUnit"
          label="商品单位"
          align="center"
          prop="goodUnit"
          min-width="12%"
        />
        <el-table-column
          key="number"
          label="应入库数量"
          align="center"
          prop="goodNumber"
          min-width="12%"
        />
        <el-table-column label="实际入库数量" fixed="right" width="220">
          <template #default="scope">
            <el-input
            v-model="scope.row.realNumber"
            placeholder="请输入商品实际入库的数量"
            clearable
            style="width: 500px"
          />
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
      v-model="subInDialog.visible"
      :title="subInDialog.title"
      width="400px"
      append-to-body
      @close="closeSubInDialog"
    >
      <el-form
          ref="userFormRef"
          :model="subInData"
          :rules="rules"
          label-width="80px"
      >
      <el-form-item label="分站库房" prop="substation" style="width: 300px;">
          <el-input
            v-model="subInData.stationName"
            placeholder=""
            clearable
            style="width: 500px"
            readonly="true"
          />
        </el-form-item>

        <el-form-item label="分发人" prop="distributor" style="width: 300px;">
          <el-input
            v-model="subInData.distributor"
            placeholder=""
            clearable
            style="width: 500px"
            readonly="true"
          />
        </el-form-item>
        <el-form-item label="签收人" prop="signer" style="width: 300px;">
          <el-input
            v-model="subInData.signer"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 300px;">
          <el-input
            v-model="subInData.remark"
            placeholder=""
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="签收日期" prop="date" style="width: 300px;">
          <el-date-picker
            v-model="subInData.date"
            placeholder=""
            clearable
            style="width: 500px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="subIn">确认入库</el-button>
          <el-button @click="closeSubInDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>



  </div>
</template>
