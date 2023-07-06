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

import { SupplyForm } from "@/api/supply/types";

defineOptions({
  name: "station",
  inheritAttrs: false,
});

import {
  insertStationForm,
  deleteStationForm,
  getStationPage,
  getStationForm,
  updateStationForm,
} from "@/api/station";

import { StationPageVO, StationForm, StationQuery } from "@/api/station/types";
/**
 * 定义ElementUI组件
 */

var stationClassList = reactive<StationForm>({});
stationClassList.value = [
  {
    id: 1,
    name: "中心库房",
  },
  {
    id: 2,
    name: "分站库房",
  },
];

const stationFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<StationQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<StationPageVO[]>();

const formData1 = reactive<StationForm>({});

const rules = reactive({
  // fname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getStationPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
    })

    .finally(() => {
      loading.value = false;
    });
}

function resetQuery1() {
  // firstCategoryFormRef.value.resetFields();

  queryParams1.nameKeyword = null;
  queryParams1.addrKeyword = null;
  queryParams1.stationClass = null;
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
    getStationForm(id).then(({ data }) => {
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
  stationFormRef.value.resetFields();
  stationFormRef.value.clearValidate();
  formData1.id = undefined;
}

const handleSubmit1 = useThrottleFn(() => {
  stationFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateStationForm(formData1)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      } else {
        insertStationForm(formData1)
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
    deleteStationForm(id)
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
    <el-row type="flex" justify="center">
      <!-- 搜索栏 -->
      <el-col>
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            <el-form-item label="库房名称" prop="nameKeyword">
              <el-input
                v-model="queryParams1.nameKeyword"
                placeholder="库房名称"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="库房地址" prop="addrKeyword">
              <el-input
                v-model="queryParams1.addrKeyword"
                placeholder="库房地址"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="库房级别" prop="stationClass">
              <el-select
                v-model="queryParams1.stationClass"
                placeholder="请选择库房级别"
                clearable
              >
                <el-option
                  v-for="item in stationClassList.value"
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
          >
            <!--						<el-table-column type="selection" width="50" align="center" />-->
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="name"
              label="库房名"
              align="center"
              prop="name"
            />
            <el-table-column
              label="地址"
              key="address"
              width="120"
              align="center"
              prop="address"
            />
            <el-table-column
              label="管理人"
              key="admin"
              width="120"
              align="center"
              prop="admin"
            />
            <el-table-column
              label="库房级别"
              key="stationClassName"
              width="120"
              align="center"
              prop="stationClassName"
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
        ref="stationFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="库房名" prop="name">
          <el-input v-model="formData1.name" placeholder="请输入库房名" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData1.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="管理人" prop="admin">
          <el-input v-model="formData1.admin" placeholder="请输入管理人" />
        </el-form-item>
        <el-form-item label="库房级别" prop="stationClass">
          <el-select
            v-model="formData1.stationClass"
            placeholder="请选择库房级别"
            clearable
          >
            <el-option
              v-for="item in stationClassList.value"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--		  <el-form-item label="级别" prop="grade">-->
        <!--			  <el-input v-model="formData1.grade" placeholder="请输入级别" />-->
        <!--		  </el-form-item>-->
        <!--		  <el-form-item label="级别" prop="stationClass">-->
        <!--			  <el-input v-model="formData1.stationClass" placeholder="请输入描述" />-->
        <!--		  </el-form-item>-->
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
