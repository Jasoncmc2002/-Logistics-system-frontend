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
  name: "secondaryCategory",
  inheritAttrs: false,
});

import {
  insertSecondaryCategoryForm,
  deleteSecondaryCategoryForm,
  getSecondaryCategoryPage,
  getSecondaryCategoryForm,
  updateSecondaryCategoryForm,
  getFirstCategoryPage,
} from "@/api/good";

import {
  SecondaryCategoryPageVO,
  SecondaryCategoryForm,
  SecondaryCategoryQuery,
  FirstCategoryForm,
} from "@/api/good/types";
/**
 * 定义ElementUI组件
 */

const SecondaryCategoryFormRef = ref(ElForm);
/**
 * ref本质也是reactive，ref(obj)等价于reactive({value: obj}) : 用于定义响应式变量
 * 定义所需变量
 * loading : 反馈是否数据加载完成

 * ids : ?
 * total : ?
 * dalog : ? 弹窗
 * queryParams : ?
 * userList : 对应用户表中的数据
 * formData : ?
 * rules : 用来规定表单中各个数据的要求
 * searchDept : ?
 * deptList : 存放dept
 * roleList ：存放role
 * importDialog : 导入用户时的弹窗
 * importDeptId : 导入选择的部门ID
 * excelFile : 用于存储一个Excel文件
 * excelFileList : 用于存储一堆Excel文件
 */
const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<SecondaryCategoryQuery>({
  pageNum: 1,
  pageSize: 10,
});
//全要查出来
const queryParams2 = reactive<FirstCategoryForm>({
  pageNum: 1,
  pageSize: 1000,
});
const userList1 = ref<SecondaryCategoryPageVO[]>();

const formData1 = reactive<SecondaryCategoryForm>({});
var firstCategoryList = reactive<FirstCategoryForm>({});

const rules = reactive({
  sname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getSecondaryCategoryPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
      handleQueryFirstCategory();
    })
    .catch((err) => {
      console.log(err);
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
  // SecondaryCategoryFormRef.value.resetFields();
  queryParams1.keywords = null;
  queryParams1.fId = null;
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
    getSecondaryCategoryForm(id).then(({ data }) => {
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
  SecondaryCategoryFormRef.value.resetFields();
  SecondaryCategoryFormRef.value.clearValidate();
  formData1.id = undefined;
}

const handleSubmit1 = useThrottleFn(() => {
  SecondaryCategoryFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateSecondaryCategoryForm(formData1)
          .then(({ data }) => {
            if (data != null) {
              ElMessage.success("修改成功");
              closeDialog1();
              resetQuery1();
            } else {
              ElMessage.warning("二级分类名重复");
            }
          })
          .finally(() => (loading.value = false));
      } else {
        insertSecondaryCategoryForm(formData1)
          .then(({ data }) => {
            if (data != null) {
              ElMessage.success("新增成功");
              closeDialog1();
              resetQuery1();
            } else {
              ElMessage.warning("二级分类名重复");
            }
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
    deleteSecondaryCategoryForm(id)
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
      <el-col :lg="24" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams1.keywords"
                placeholder="查询二级商品分类"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery1"
              />
            </el-form-item>
            <el-form-item label="一级分类" prop="fid">
              <el-select
                v-model="queryParams1.fId"
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
              key="sname"
              label="二级分类名"
              align="center"
              prop="sname"
              width="250"
            />

            <el-table-column
              label="一级商品名称"
              key="fname"
              width="250"
              align="center"
              prop="fname"
            />
            <el-table-column
              label="描述"
              key="description"
              width="250"
              align="center"
              prop="description"
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

          <!-- 表单结束位置 -->

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
        ref="SecondaryCategoryFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="类别名" prop="sname">
          <el-input v-model="formData1.sname" placeholder="请输入二级类别名" />
        </el-form-item>
        <!--        <el-form-item label="一级商品id" prop="fid">-->
        <!--          <el-input v-model="formData1.fid" placeholder="请输入一级类别ID" />-->
        <!--        </el-form-item>-->
        <el-form-item label="一级分类名称" prop="fid">
          <el-select
            v-model="formData1.fid"
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
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData1.description" placeholder="请输入描述" />
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
