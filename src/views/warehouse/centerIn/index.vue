<!--字典类型-->
<script setup lang="ts">
defineOptions({
  name: "CenterIn",
  inheritAttrs: false,
});

// 导入需要的api方法,需要用{}括起来（哪怕只引入一种方法）
import { getBuyListByCriteria , submitCenterIn} from "@/api/warehouse";

// 导入需要的数据类型，需要用{}括起来（哪怕只引入一种数据）
import { BuyQuery , BuyPageVO , InOutStation } from "@/api/warehouse/types";

// 导入时间选择器
import { ElDatePicker } from "element-plus";
import { forEach } from "lodash";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

// 查询参数
const queryParams = reactive<BuyQuery>({
  pageNum: 1,
  pageSize: 10,
  id:""
});

const inOutStation = reactive<InOutStation>({})

// 表格显示的数据
const buyList = ref<BuyPageVO[]>([]);

// 声明一个待用弹窗，初始为不可见
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
  // getTaskListByCriteria(queryParams)
  //   .then(({ data }) => {
  //     taskList.value = data.list;
  //     total.value = data.total;
  //     dropDownBarDataRefresh();
  //     console.log("打印加载到的所有任务类型");
  //     console.log(taskTypeList);
  //     console.log("打印加载到的所有任务类型结束");
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
  getBuyListByCriteria(queryParams)
    .then(({ data }) => {
      loading.value = true;
      buyList.value = data.list;
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
  queryParams.id = undefined;
  handleQuery();
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
        <el-form-item label="购货单号" prop="name">
          <el-input
            v-model="queryParams.id"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
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
    <!-- 购入单签收详细信息录入栏 -->
    <el-card>
      <el-form ref="queryFormRef" :model="inOutStation" :inline="true">
        <!-- 搜索关键字 -->
        <!-- date picker的model报错是因为element-plus的版本问题，不影响正常使用  -->
        <el-form-item label="货物号码" prop="goodId" style="width: 300px;">
          <el-input
            v-model="inOutStation.goodId"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="供应商源" prop="supply" style="width: 300px;">
          <el-input
            v-model="inOutStation.supply"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="购货日期" prop="buyDate" style="width: 300px;">
          <el-input
            v-model="inOutStation.buyDate"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <br>
        <el-form-item label="签收人员" prop="signer" style="width: 300px;">
          <el-input
            v-model="inOutStation.signer"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="签收日期" prop="buyDate" style="width: 300px;">
          <el-date-picker
            v-model="inOutStation.date"
            placeholder="购货日期"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" style="width: 300px;">
          <el-input
            v-model="inOutStation.remark"
            placeholder=""
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <br>
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" @click="centerIn()"
            ><i-ep-search />提交回执</el-button
          >
          <el-button @click="clearCenterIn()"><i-ep-refresh />清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
        :data="buyList"
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
          label="一级类别"
          align="center"
          prop="goodClass"
          min-width="12%"
        />
        <el-table-column
          key="goodSubclass"
          label="二级类别"
          align="center"
          prop="goodSubclass"
          min-width="12%"
        />
        <el-table-column
          key="goodUnit"
          label="商品单位"
          align="center"
          prop="goodUnit"
          min-width="12%"
        />
        <el-table-column
          key="buyNumber"
          label="应入库数量"
          align="center"
          prop="buyNumber"
          min-width="12%"
        />
        <el-table-column label="实际入库数量" fixed="right" width="220">
              <template #default="scope">
                <el-input 
                v-model="scope.row.number"
                placeholder=""
                clearable
                @blur="actualNumber(scope.row)"
                style="min-width=12%">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="primary"
                  link
                  size="small"
                  @click="selectBuy(scope.row)"
                  min-width="12%"
                  ><i-ep-delete />选择</el-button
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
