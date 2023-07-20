<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Tasks",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getTaskListByCriteria ,getAllSubstation } from "@/api/submanage";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { TaskPageVO, TaskQuery, TaskType , SubstationInfo, StationQuery} from "@/api/submanage/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

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

// 表格显示的数据
const taskList = ref<TaskPageVO[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
});

// 所有分站
const substationList = ref<SubstationInfo[]>([])


const stationQuery = reactive<StationQuery>({
    pageNum: 1,
    pageSize: 100
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
 * 加载所有分站信息
 */
 function getStationList() {
  getAllSubstation(stationQuery)
    .then(({ data }) => {
      substationList.value = data.list;
    })
    .finally()
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

onMounted(() => {
  handleQuery();
  getStationList();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="分站" prop="name">
          <el-select v-model="queryParams.substation" clearable>
            <el-option
              v-for="item in substationList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
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
        <el-form-item label="任务状态" prop="status">
          <el-select
            v-model="queryParams.taskStatus"
            placeholder="全部"
            clearable
            style="width: 200px"
          >
            <el-option label="已调度" value="已调度" />
            <el-option label="可分配" value="可分配" />
            <el-option label="已分配" value="已分配" />
            <el-option label="已领货" value="已领货" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>

        <el-form-item>
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
          prop="orderId"
          width="100"
        />
        <el-table-column
          key="id"
          label="任务号"
          align="center"
          prop="id"
          width="100"
        />
        <el-table-column
          key="substation"
          label="分站"
          align="center"
          prop="substation"
          width="100"
        />
        <el-table-column
          key="taskType"
          label="任务类型"
          align="center"
          prop="taskType"
          width="100"
        />
        <el-table-column
          key="customerName"
          label="客户姓名"
          align="center"
          prop="customerName"
          width="100"
        />
        <el-table-column
          key="address"
          label="投递地址"
          align="center"
          prop="address"
          width="100"
        />
        <el-table-column
          key="receiveName"
          label="接收人姓名"
          align="center"
          prop="receiveName"
          width="100"
        />
        <el-table-column
          key="deadline"
          label="要求完成日期"
          align="center"
          prop="deadline"
          width="100"
        />
        <el-table-column
          key="goodSum"
          label="商品总价值"
          align="center"
          prop="goodSum"
          width="100"
        />
        <el-table-column
          key="taskStatus"
          label="任务状态"
          align="center"
          prop="taskStatus"
          width="100"
        />
        <el-table-column
          key="isInvoice"
          label="是否要发票"
          align="center"
          prop="isInvoice"
          width="100"
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
  </div>
</template>
