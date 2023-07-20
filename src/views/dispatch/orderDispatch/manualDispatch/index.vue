<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "ManualDispatch",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////
// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getOrderListByCriteria , getAutoDispatch , submitDispatch , getAllSubstation} from "@/api/dispatch/manualDispatch"

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { AutoQuery , OrderPageVO , SubstationInfo , StationQuery} from "@/api/dispatch/manualDispatch/types"

// 导入时间选择器等插件
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

// 当前登录用户的用户信息
import { useUserStore } from "@/store/modules/user";
import { tr } from "element-plus/es/locale";
import { SubmitRequest } from "@/api/dispatch/autoDispatch/types";
const userStore = useUserStore();
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

// 声明一个待用弹窗，初始为不可见
const dialog = reactive<DialogOption>({
  visible: false,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---前后端交互所需要的数据---///////////////////////////////////////////////////////////////////////////////

///////////////////////---调用后端所需要的数据结构---//////////////////////////

// 查询参数
const queryParams = reactive<AutoQuery>({
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2100, 10, 10, 10, 10),
  startTime: new Date(2000, 10, 10, 10, 10),
  goodStatus: "缺货",
  orderType:""
});

// 要求出库日期以及要求配送日期
const requiredDateData = ref({
  allocationDate: "",
  deadline: ""
});

const stationQuery = reactive<StationQuery>({
    pageNum: 1,
    pageSize: 100
  });


///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const orderList = ref<OrderPageVO[]>([])

// 弹窗表单所需要显示的数据
const orderDialogList = ref<OrderPageVO[]>([])

// 所有分站
const substationList = ref<SubstationInfo[]>([])

// 提交数据
const submitData = ref<SubmitRequest>({});

///////////////////////---格式要求设置---//////////////////////////

// 新建相关格式要求设置
const rules = reactive({
  name: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  substation: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////---方法---///////////////////////////////////////////////////////////////////////////////

///////////////////////---加载数据---//////////////////////////

/**
 * 查询/也用作加载所有数据
 */
function handleQuery() {
  loading.value = true;
  getOrderListByCriteria(queryParams)
    .then(({ data }) => {
      loading.value = true;
      orderList.value = data.list;
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
  queryParams.orderType = undefined;
  queryParams.startTime = undefined;
  queryParams.endTime = undefined;
  queryParams.goodStatus = "";
  handleQuery();
}

/**
 * 加载所有分站信息
 */
 function getStationList() {
  getAllSubstation(stationQuery)
    .then(({ data }) => {
      substationList.value = data.list;
    })
    .finally()
}


///////////////////////---多选事件---//////////////////////////

/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
  console.log(ids.value); // 输出ids列表数组或数组map对象的值，不要涉及任何处

}

///////////////////////---基础按钮事件---//////////////////////////

/**
 * 对选定的表单进行自动调度操作
 */
 function autoDispatch(ids: number[]){
  if(ids.length==0){
    ElMessage.warning("请选择要调度的顶顶那");
    return;
  }

  // 根据ids调取弹窗所需要的表单数据,并且调用自动分配分站的api为每一条数据分配分站
  for(let i=0; i<orderList.value.length; i++){
    for(let j=0; j<ids.length; j++){ 
      if(orderList.value.at(i).id === ids[j]){
        orderList.value.at(i).substationId = undefined;
        orderDialogList.value.push(orderList.value.at(i)); // 将每条记录加入dialog列表中 并且将dialog
      }
    }
  }

  // for (let i = 0; i < orderDialogList.value.length; i++){
  //   getAutoDispatch()
  //     .then(({ data }) => {
  //       orderDialogList.value.at(i).substationId = data.substationId;
  //       orderDialogList.value.at(i).substationName = data.substationName;
  //     })
  // }

  console.log(orderDialogList.value);

  openDialog(); // 打开弹窗

}

///////////////////////---弹窗相关事件---//////////////////////////

/**
 * 打开弹窗
 */
function openDialog(){
  dialog.title = "确认调度信息"
  dialog.visible = true;
}

/**
 * 关闭弹窗
 */
 function closeDialog() {
  dialog.visible = false;
  orderDialogList.value=[];
}

/**
 * 提交调度信息
 */
function submitAutoDispatch(){
  if(requiredDateData.value.allocationDate == undefined || requiredDateData.value.deadline == undefined || requiredDateData.value.allocationDate == "" || requiredDateData.value.deadline == "" || requiredDateData.value.allocationDate == null || requiredDateData.value.deadline == null  ){
    ElMessage.warning("请补全时间信息");
    return;
  }
  for (let i = 0; i < orderDialogList.value.length; i++){
    if(orderDialogList.value.at(i).substationId == undefined){
      ElMessage.warning("部分订单还没有手动分配分站");
      return;
    }
    orderDialogList.value.at(i).allocationDate = requiredDateData.value.allocationDate;
    orderDialogList.value.at(i).deadline = requiredDateData.value.deadline;

  }
  submitData.value.Orders = orderDialogList.value;
  submitData.value.allocationDate = requiredDateData.value.allocationDate;
  submitData.value.deadline = requiredDateData.value.deadline;
  submitData.value.creator = userStore.nickname;
  submitDispatch(submitData.value)
    .then(({ data }) =>{
      ElMessage.success("手动调度成功！");
      handleQuery();
      clearDateData();
      closeDialog();
    });
}

/**
 * 清空需要填写的时间表格中的数据
 */
function clearDateData(){
  requiredDateData.value.allocationDate = "";
  requiredDateData.value.deadline = "";
}

///////////////////////---挂载时自动渲染---//////////////////////////

onMounted(() => {
  getStationList();
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
        <el-form-item label="选择订单类型" prop="orderType">
          <el-select
            v-model="queryParams.orderType"
            placeholder="全部"
            clearable
            style="width: 200px"
          >
            <el-option label="全部" value="" />
            <el-option label="新订" value="新订" />
            <el-option label="换货" value="换货" />
            <el-option label="退货" value="退货" />
            <el-option label="退订" value="退订" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围" prop="startLine" style="width: 300px;">
          <el-date-picker
            v-model="queryParams.startTime"
            placeholder=""
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
          
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item label="" prop="endLine" style="width: 300px;">
          <el-date-picker
            v-model="queryParams.endTime"
            placeholder=""
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
          <el-button @click="autoDispatch(ids)"><i-ep-refresh />手动调度</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单详细信息表单 -->
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
        :data="orderList"
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
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          key="id"
          label="订单号"
          align="center"
          prop="id"
          min-width="12%"
        />
        <el-table-column
          key="orderStatus"
          label="订单状态"
          align="center"
          prop="orderStatus"
          min-width="12%"
        />
        <el-table-column
          key="orderType"
          label="订单类型"
          align="center"
          prop="orderType"
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
          key="orderDate"
          label="订单生成日期"
          align="center"
          prop="orderDate"
          min-width="12%"
        />
        <el-table-column
          key="receiveName"
          label="收货人"
          align="center"
          prop="receiveName"
          min-width="12%"
        />
        <el-table-column
          key="address"
          label="地址"
          align="center"
          prop="customerAddress"
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
      width="1200px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
          ref="userFormRef"
          :model="requiredDateData"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="要求出库日期" prop="allocationDate" style="width: 300px;">
          <el-date-picker
            v-model="requiredDateData.allocationDate"
            placeholder="分发日期"
            clearable
            style="width: 500px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="要求配送日期" prop="deadline" style="width: 300px;">
          <el-date-picker
            v-model="requiredDateData.deadline"
            placeholder="分发日期"
            clearable
            style="width: 500px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-form>
      <el-card shadow="never">
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
          :data="orderDialogList"
          border
          :rules="rules"
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
            key="orderId"
            label="订单号"
            align="center"
            prop="orderId"
            min-width="12%"
          />
          <el-table-column
            key="orderStatus"
            label="订单状态"
            align="center"
            prop="orderStatus"
            min-width="12%"
          />
          <el-table-column
            key="orderType"
            label="订单类型"
            align="center"
            prop="orderType"
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
            key="orderDate"
            label="订单生成日期"
            align="center"
            prop="orderDate"
            min-width="12%"
          />
          <el-table-column
            key="receiveName"
            label="收货人"
            align="center"
            prop="receiveName"
            min-width="12%"
          />
          <el-table-column label="执行分站" fixed="right" width="220" prop="substation">
              <template #default="scope">
                <el-select v-model="scope.row.substationId" clearable>
                  <el-option
                    v-for="item in substationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
          </el-table-column>
          <el-table-column
            key="creater"
            label="录入员"
            align="center"
            prop="creater"
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
          v-model:total="dialogTotal"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery"
        />
      </el-card>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAutoDispatch">提交调度信息</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
