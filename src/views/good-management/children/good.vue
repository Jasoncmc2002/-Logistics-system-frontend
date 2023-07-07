<script setup lang="ts">
/**
 * setup ： 语法糖，可以省去子组件在父组件的components中注册的过程，直接import之后就可以使用
 * lang="ts" ： 表示此文件是TypeScript格式
 */

/**
 * @see {@link https://vuejs.org/api/sfc-script-setup.html#defineoptions}
 */

/**
 * defineOptions : 语法糖，定义本文件name
 */

defineOptions({
  name: "good",
  inheritAttrs: false,
});

import {
  insertCentralStationForm,
  deleteCentralStationForm,
  getCentralStationPage,
  getCentralStationForm,
  updateCentralStationForm,
} from "@/api/category";

import {
  CentralStationPageVO,
  CentralStationForm,
  CentralStationQuery,
} from "@/api/category/types";
import {
  insertSupplyForm,
  deleteSupplyForm,
  getSupplyPage,
  getSupplyForm,
  updateSupplyForm,
} from "@/api/supply";

import { SupplyPageVO, SupplyForm, SupplyQuery } from "@/api/supply/types";

import {
  insertFirstCategoryForm,
  deleteFirstCategoryForm,
  getFirstCategoryPage,
  getFirstCategoryForm,
  updateFirstCategoryForm,
} from "@/api/category";

import {
  insertSecondaryCategoryForm,
  deleteSecondaryCategoryForm,
  getSecondaryCategoryPage,
  getSecondaryCategoryForm,
  updateSecondaryCategoryForm,
} from "@/api/category";
import {
  insertSecondaryCategoryForm,
  deleteSecondaryCategoryForm,
  getFirstCategoryPage,
  getSecondaryCategoryForm,
  updateSecondaryCategoryForm,
} from "@/api/category";

import {
  SecondaryCategoryPageVO,
  SecondaryCategoryForm,
  SecondaryCategoryQuery,
} from "@/api/category/types";

import {
  SecondaryCategoryPageVO,
  FirstCategoryForm,
  SecondaryCategoryQuery,
} from "@/api/category/types";

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

var supplyList = reactive<SupplyForm>({});
var firstCategoryList = reactive<FirstCategoryForm>({});
var secondaryCategoryList = reactive<SecondaryCategoryForm>({});
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
      handleQuerySupply();
      handleQuerySecondaryCategory();
      handleQueryFirstCategory();
    })

    .finally(() => {
      loading.value = false;
    });
}
function handleQuerySupply() {
  loading.value = true;
  getSupplyPage(queryParams2)
    .then(({ data }) => {
      supplyList.value = data.list;
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

/**
 * 删除用户
 */

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

onMounted(() => {
  handleQuery1();
});
</script>

<template>
  <div class="app-container">
    <el-row>
      <!-- 搜索栏 -->
      <el-col :lg="12" :xs="24">
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
            <el-form-item label="供应商" prop="supplyId">
              <el-select
                v-model="queryParams1.supplyId"
                placeholder="请选择供应商"
                clearable
              >
                <el-option
                  v-for="item in supplyList.value"
                  :key="item.id"
                  :label="item.name"
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
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="openDialog1()"
                  ><i-ep-plus />新增</el-button
                >
                <!--                <el-button-->
                <!--                  v-hasPerm="['sys:user:delete']"-->
                <!--                  type="danger"-->
                <!--                  :disabled="ids.length === 0"-->
                <!--                  @click="handleDelete1()"-->
                <!--                  ><i-ep-delete />删除</el-button-->
                <!--                >-->
              </div>
            </div>
          </template>

          <!-- 表单开始位置 -->

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
              width="100"
            />
            <el-table-column
              key="goodName"
              label="商品名"
              align="center"
              prop="goodName"
            />
            <el-table-column
              label="一级类别名"
              key="goodClassName"
              width="120"
              align="center"
              prop="goodClassName"
            />
            <el-table-column
              label="二级类别名"
              key="goodSubClassName"
              width="120"
              align="center"
              prop="goodSubClassName"
            />
            <el-table-column
              label="库存量"
              key="stock"
              width="120"
              align="center"
              prop="stock"
            />
            <el-table-column
              label="退货量"
              key="withdrawal"
              width="120"
              align="center"
              prop="withdrawal"
            />
            <el-table-column
              label="可分配量"
              key="waitAllo"
              width="120"
              align="center"
              prop="waitAllo"
            />
            <el-table-column
              label="已分配量"
              key="doneAllo"
              width="120"
              align="center"
              prop="doneAllo"
            />
            <el-table-column
              label="警戒值"
              key="warn"
              width="120"
              align="center"
              prop="warn"
            />
            <el-table-column
              label="最大值"
              key="max"
              width="120"
              align="center"
              prop="max"
            />
            <el-table-column
              label="商品价格"
              key="goodPrice"
              width="120"
              align="center"
              prop="goodPrice"
            />
            <el-table-column
              label="进货成本价"
              key="goodCost"
              width="120"
              align="center"
              prop="goodCost"
            />
            <el-table-column
              label="商品折扣"
              key="goodSale"
              width="120"
              align="center"
              prop="goodSale"
            />

            <el-table-column
              label="计量单位"
              key="goodUnit"
              width="120"
              align="center"
              prop="goodUnit"
            />

            <el-table-column
              label="供货商姓名"
              key="supplyName"
              width="120"
              align="center"
              prop="supplyName"
            />

            <el-table-column
              label="保质期"
              key="sellDate"
              width="120"
              align="center"
              prop="sellDate"
            />

            <el-table-column
              label="可否退货"
              key=" isReturnName"
              width="120"
              align="center"
              prop="isReturnName"
            />
            <el-table-column
              label="可否换货"
              key="isChangeName"
              width="120"
              align="center"
              prop="isChangeName"
            />
            <el-table-column
              label="描述"
              key="remark"
              width="120"
              align="center"
              prop="remark"
            />

            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="openDialog1(scope.row.id)"
                  ><i-ep-edit />编辑</el-button
                >
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete1(scope.row.id)"
                  ><i-ep-delete />删除</el-button
                >
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

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      append-to-body
      @close="closeDialog1"
    >
      <el-form
        ref="CentralStationFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goodNname">
          <el-input v-model="formData1.goodName" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="一级分类" prop="goodClassId">
          <el-select
            v-model="formData1.goodClassId"
            placeholder="请选择一级分类名"
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
            v-model="formData1.goodSubclassId"
            placeholder="请选择二级分类名"
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
        <el-form-item label="计量单位" prop="goodUnit">
          <el-input v-model="formData1.goodUnit" placeholder="请输入计量单位" />
        </el-form-item>
        <el-form-item label="售价" prop="goodPrice">
          <el-input v-model="formData1.goodPrice" placeholder="请输入售价" />
        </el-form-item>
        <el-form-item label="商品折扣" prop="goodSale">
          <el-input v-model="formData1.goodSale" placeholder="请输入折扣" />
        </el-form-item>
        <el-form-item label="成本价" prop="goodCost">
          <el-input v-model="formData1.goodCost" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplyId">
          <el-select v-model="formData1.supplyId" placeholder="请选择供应商">
            <el-option
              v-for="item in supplyList.value"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保质期" prop="sellDate">
          <el-input v-model="formData1.sellDate" placeholder="请输入保质期" />
        </el-form-item>
        <el-form-item label="可否退货" prop="isReturn">
          <el-radio-group v-model="formData1.isReturn">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可否换货" prop="isChange">
          <el-radio-group v-model="formData1.isChange">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="库存量" prop="stock">
          <el-input v-model="formData1.stock" placeholder="请输入库存量" />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData1.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit1">确 定</el-button>
          <el-button @click="closeDialog1">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
