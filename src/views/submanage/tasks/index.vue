<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "Tasks",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getTaskListByCriteria } from "@/api/submanage/tasks";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { AnalyzePageVO, TaskQuery } from "@/api/submanage/tasks/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<TaskQuery>({
  pageNum: 1,
  pageSize: 10,
  substation: null,
  taskStatus: null,
  taskType: null,
  startLine: null,
  endLine: null,
});

// 表格显示的数据
const taskList = ref<AnalyzePageVO[]>();

const dialog = reactive<DialogOption>({
  visible: false,
});

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
  queryParams.substation = null;
  queryParams.taskStatus = null;
  queryParams.taskType = null;
  queryParams.startLine = null;
  queryParams.endLine = null;
  handleQuery();
}

/**
 * checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="关键字" prop="name">
          <el-input
            v-model="queryParams.substation"
            placeholder="分站名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />

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
        <el-form-item>
          <el-input
            v-model="queryParams.taskStatus"
            placeholder="任务状态"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryParams.taskType"
            placeholder="任务类型"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
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
          key="endDate"
          label="送到日期"
          align="center"
          prop="endDate"
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
