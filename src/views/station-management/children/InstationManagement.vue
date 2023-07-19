<script setup lang="ts">
defineOptions({
  name: "instation",
  inheritAttrs: false,
});

import {
  insertCentralStationForm,
  deleteCentralStationForm,
  getCentralStationPage,
  getCentralStationForm,
  updateCentralStationForm,
  addBuyList,
  addRegisterList,
  checkAllVacancy,
} from "@/api/good";

import {
  CentralStationPageVO,
  CentralStationForm,
  CentralStationQuery,
} from "@/api/good/types";
import {
  insertFirstCategoryForm,
  deleteFirstCategoryForm,
  getFirstCategoryPage,
  getFirstCategoryForm,
  updateFirstCategoryForm,
} from "@/api/good";

import {
  FirstCategoryPageVO,
  FirstCategoryForm,
  FirstCategoryQuery,
} from "@/api/good/types";

import {
  insertSecondaryCategoryForm,
  deleteSecondaryCategoryForm,
  getSecondaryCategoryPage,
  getSecondaryCategoryForm,
  updateSecondaryCategoryForm,
} from "@/api/good";

import {
  SecondaryCategoryPageVO,
  SecondaryCategoryForm,
  SecondaryCategoryQuery,
} from "@/api/good/types";
import { createEditor } from "@wangeditor/editor";

const CentralStationFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<CentralStationQuery>({
  pageNum: 1,
  pageSize: 10,
});
//全要查出来
const queryParams2 = reactive<CentralStationQuery>({
  pageNum: 1,
  pageSize: 1000,
});

const userList1 = ref<CentralStationPageVO[]>();

const formData1 = reactive<CentralStationForm>({});

var firstCategoryList = reactive<FirstCategoryForm>({});
var secondaryCategoryList = reactive<SecondaryCategoryForm>({});

var inStationList = reactive<number>({});
const queryParams3 = reactive({
  list: inStationList,
  time: undefined,
  supply: undefined,
});
// const supplyList=reactive({});
// const firstCategoryList=reactive({});
// const secondaryCategoryList=reactive({});

const rules = reactive({
  // fname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getCentralStationPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;

      handleQuerySecondaryCategory();
      handleQueryFirstCategory();
    })

    .finally(() => {
      loading.value = false;
    });
}

function handleQuerySecondaryCategory() {
  loading.value = true;
  getSecondaryCategoryPage(queryParams2)
    .then(({ data }) => {
      secondaryCategoryList.value = data.list;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleQueryFirstCategory() {
  loading.value = true;
  getFirstCategoryPage(queryParams2)
    .then(({ data }) => {
      firstCategoryList.value = data.list;
    })
    .finally(() => {
      loading.value = false;
    });
}

function resetQuery1() {
  // CentralStationFormRef.value.resetFields();
  // console.log("OK");

  queryParams3.time = null;
  queryParams1.keywords = null;
  queryParams1.goodClassId = null;
  queryParams1.goodSubclassId = null;
  queryParams1.supplyId = null;
  queryParams1.pageNum = 1;
  handleQuery1();
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

async function openDialog1(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改";
    getCentralStationForm(id).then(({ data }) => {
      Object.assign(formData1, data);
    });
  } else {
    dialog.title = "新增";
  }
}

function closeDialog1() {
  dialog.visible = false;
  resetForm1();
}

function resetForm1() {
  CentralStationFormRef.value.resetFields();
  CentralStationFormRef.value.clearValidate();
  formData1.id = undefined;
}

const handleSubmit1 = useThrottleFn(() => {
  CentralStationFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateCentralStationForm(formData1)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      } else {
        insertCentralStationForm(formData1)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

function handleDelete1(id?: number) {
  if (!id) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    deleteCentralStationForm(id)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery1();
      })
      .finally(() => (loading.value = false));
  });
}
function checkAll() {
  loading.value = true;
  queryParams1.pageSize = 1000;
  getCentralStationPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;

      userList1.value = userList1.value.filter(function (item) {
        return item.vacancy !== 0;
      });
      total.value = userList1.value.length;
      handleQuerySecondaryCategory();
      handleQueryFirstCategory();
    })
    .finally(() => {
      loading.value = false;
    });
}

// const queryParams4={
// 	"list":queryParams3.list,
// 	"time":queryParams3.time,
// }
function addBuy() {
  // console.log(queryParams3);
  loading.value = true;
  addBuyList(queryParams3)
    .then(({ data }) => {
      if (data != null) {
        ElMessage.success("批量新增进货单成功");
      } else {
        ElMessage.warning("输入进货量不正确");
      }
      resetQuery1();
    })
    .finally(() => {
      loading.value = false;
    });
}
function addRegister() {
  // console.log(queryParams3);
  loading.value = true;
  addRegisterList(queryParams3)
    .then(({ data }) => {
      if (data != null) {
        ElMessage.success("批量新增购货入库调拨单成功");
      } else {
        ElMessage.warning("输入进货量不正确");
      }
      resetQuery1();
    })

    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  handleQuery1();
});
</script>

<template>
  <div class="app-container">
    <el-row>
      <!-- 搜索栏 -->
      <el-col :lg="24" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams1.keywords"
                placeholder="查询商品"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="一级分类" prop="goodClassId">
              <el-select
                v-model="queryParams1.goodClassId"
                placeholder="请选择一级分类名"
                clearable
              >
                <el-option
                  v-for="item in firstCategoryList.value"
                  :key="item.id"
                  :label="item.fname"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="goodSubclassId">
              <el-select
                v-model="queryParams1.goodSubclassId"
                placeholder="请选择二级分类名"
                clearable
              >
                <el-option
                  v-for="item in secondaryCategoryList.value"
                  :key="item.id"
                  :label="item.sname"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery1"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery1">
                <i-ep-refresh />
                重置</el-button
              >
              <el-button type="primary" @click="checkAll"
                ><i-ep-search />缺货检查</el-button
              >
              <el-button @click="addBuy">新增进货单</el-button>
              <el-button @click="addRegister">新增购货入库调拨单</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-date-picker
                  v-model="queryParams3.time"
                  placeholder="选择时间"
                  clearable
                  type="datetime"
                  style="width: 200px"
                />
                &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                <el-input
                  v-model="queryParams3.supply"
                  placeholder="输入供应商"
                  clearable
                  style="width: 200px"
                />
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="userList1"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <!--            <el-table-column type="selection" width="50" align="center" />-->
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="150"
            />
            <el-table-column
              key="goodName"
              label="商品名"
              align="center"
              width="150"
              prop="goodName"
            />
            <el-table-column
              label="一级类别名"
              key="goodClassName"
              width="150"
              align="center"
              prop="goodClassName"
            />
            <el-table-column
              label="二级类别名"
              key="goodSubClassName"
              width="150"
              align="center"
              prop="goodSubClassName"
            />

            <el-table-column
              label="可分配量"
              key="waitAllo"
              width="150"
              align="center"
              prop="waitAllo"
            />
            <el-table-column
              label="警戒值"
              key="warn"
              width="100"
              align="center"
              prop="warn"
            />
            <el-table-column
              label="最大值"
              key="max"
              width="100"
              align="center"
              prop="max"
            />

            <el-table-column label="进货量" fixed="right" width="220">
              <template #default="scope">
                <el-input v-model="queryParams3.list[scope.row.id]" clearable />
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams1.pageNum"
            v-model:limit="queryParams1.pageSize"
            @pagination="handleQuery1"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
