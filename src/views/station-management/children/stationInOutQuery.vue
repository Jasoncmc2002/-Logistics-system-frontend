<script setup lang="ts">
defineOptions({
  name: "stationInOutQuery",
  inheritAttrs: false,
});

import {
  insertStationInOutForm,
  deleteStationInOutForm,
  getStationInOutPage,
  getStationInOutForm,
  updateStationInOutForm,
} from "@/api/station";

import {
  StationInOutPageVO,
  StationInOutForm,
  StationInOutQuery,
  StationForm,
} from "@/api/station/types";
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

const stationInOutFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});

const queryParams1 = reactive<StationInOutQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<StationInOutPageVO[]>();

const formData1 = reactive<StationInOutForm>({});

const rules = reactive({
  // fname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

function handleQuery1() {
  loading.value = true;
  getStationInOutPage(queryParams1)
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

  queryParams1.stationKeyword = null;
  queryParams1.goodKeyword = null;
  queryParams1.typeKeyword = null;
  queryParams1.startTime = null;
  queryParams1.endTime = null;
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
    getStationInOutForm(id).then(({ data }) => {
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
  stationInOutFormRef.value.resetFields();
  stationInOutFormRef.value.clearValidate();
  formData1.id = undefined;
}

const handleSubmit1 = useThrottleFn(() => {
  stationInOutFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateStationInOutForm(formData1)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      } else {
        insertStationInOutForm(formData1)
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
    deleteStationInOutForm(id)
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
            <el-form-item label="库房级别" prop="stationClass">
              <el-select
                v-model="queryParams1.stationKeyword"
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
            <el-form-item label="出入库类型" prop="typeKeyword">
              <el-input
                v-model="queryParams1.typeKeyword"
                placeholder="出入库类型"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="起始时间" prop="startTime">
              <el-date-picker
                v-model="queryParams1.startTime"
                placeholder="选择起始时间"
                clearable
                type="datetime"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="queryParams1.endTime"
                placeholder="选择结束时间"
                clearable
                type="datetime"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="商品名称" prop="goodKeyword">
              <el-input
                v-model="queryParams1.goodKeyword"
                placeholder="商品名称"
                clearable
                style="width: 200px"
              />
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
                <!--								<el-button-->
                <!--										v-hasPerm="['sys:user:add']"-->
                <!--										type="success"-->
                <!--										@click="openDialog1()"-->
                <!--								><i-ep-plus />新增</el-button-->
                <!--								>-->
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
              key="stationName"
              label="库房名"
              align="center"
              prop="stationName"
            />
            <el-table-column
              label="商品名称"
              key="goodName"
              width="120"
              align="center"
              prop="goodName"
            />
            <el-table-column
              label="单位"
              key="goodUnit"
              width="120"
              align="center"
              prop="goodUnit"
            />
            <el-table-column
              label="单价"
              key="goodPrice"
              width="120"
              align="center"
              prop="goodPrice"
            />
            <el-table-column
              label="出入库数量"
              key="number"
              width="120"
              align="center"
              prop="number"
            />
            <el-table-column
              label="出入库类型"
              key="type"
              width="120"
              align="center"
              prop="type"
            />
            <el-table-column
              label="库房级别"
              key="stationClassName"
              width="120"
              align="center"
              prop="stationClassName"
            />
            <el-table-column
              label="备注"
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
        ref="stationInOutFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="库房名" prop="stationName">
          <el-input
            v-model="formData1.stationName"
            placeholder="请输入库房名"
          />
        </el-form-item>
        <el-form-item label="出入库数量" prop="description">
          <el-input v-model="formData1.number" placeholder="请输入出入库数量" />
        </el-form-item>

        <el-form-item label="库房级别" prop="stationInOutClass">
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

        <el-form-item label="备注" prop="admin">
          <el-input v-model="formData1.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="出入库类型" prop="admin">
          <el-input v-model="formData1.type" placeholder="请输入出入库类型" />
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
