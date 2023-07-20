<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "AutoDispatch",
  inheritAttrs: false,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////---import---///////////////////////////////////////////////////////////////////////////////
// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getOrderListByCriteria , submitChangeOrderStatus } from "@/api/dispatch/editOrderStatus"

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { EditOrderQuery , OrderPageVO , UpdateData} from "@/api/dispatch/editOrderStatus/types"

// 导入时间选择器等插件
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

// 当前登录用户的用户信息
import { useUserStore } from "@/store/modules/user";
import { tr } from "element-plus/es/locale";
const userStore = useUserStore();
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
const queryParams = reactive<EditOrderQuery>({
  pageNum: 1,
  pageSize: 10,
  endTime: new Date(2100, 10, 10, 10, 10),
  startTime: new Date(2000, 10, 10, 10, 10),
});

// 要求出库日期以及要求配送日期
const requiredDateData = ref({
  allocationDate: "",
  deadline: ""
});

///////////////////////---渲染表格所需要的数据---//////////////////////////

// 表格显示的数据
const orderList = ref<OrderPageVO[]>([])

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
  queryParams.startTime = undefined;
  queryParams.endTime= undefined;
  handleQuery();
}

///////////////////////---多选事件---//////////////////////////

/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

///////////////////////---基础按钮事件---//////////////////////////

function submit(row: { [key: string]: any }){
  const updateData = reactive<UpdateData>(
    {
      id: row.id,
      orderStatus: "可分配"
    }
  );
  submitChangeOrderStatus(updateData)
  .then(({data})=>{
    ElMessage.success("改变订单状态成功")
    handleQuery();
  });
}

///////////////////////---弹窗相关事件---//////////////////////////

/**
 * 打开弹窗
 */
function openDialog(){
  dialog.title = ""
  dialog.visible = true;
}

/**
 * 关闭弹窗
 */
 function closeDialog() {
  dialog.visible = false;
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

        <el-form-item label="时间范围" prop="startTime" style="width: 300px;">
          <el-date-picker
            v-model="queryParams.startTime"
            placeholder=""
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
          
        </el-form-item>
        <el-form-item>-</el-form-item>
        <el-form-item label="" prop="endTime" style="width: 300px;">
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

        <el-table-column
          key="orderId"
          label="订单号"
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
          key="address"
          label="地址"
          align="center"
          prop="customerAddress"
          min-width="12%"
        />
        <el-table-column
          key="postcode"
          label="邮编"
          align="center"
          prop="postcode"
          min-width="12%"
        />
        <el-table-column
          key="phone"
          label="电话"
          align="center"
          prop="mobilephone"
          min-width="12%"
        />
        <el-table-column
          key="buyDate"
          label="订购日期"
          align="center"
          prop="orderDate"
          min-width="12%"
        />
        <el-table-column
          key="orderStatus"
          label="订单状态"
          align="center"
          prop="orderStatus"
          min-width="12%"
        />
        <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="submit(scope.row)"
                  ><i-ep-refresh-left />提交</el-button
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
