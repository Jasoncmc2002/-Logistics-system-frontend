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
  name: "firstCategory",
  inheritAttrs: false,
});



import {
  insertFirstCategoryForm,
  deleteFirstCategoryForm,
  getFirstCategoryPage,
  getFirstCategoryForm,
  updateFirstCategoryForm
} from "@/api/category";


import {FirstCategoryPageVO,FirstCategoryForm,FirstCategoryQuery } from "@/api/category/types";
/**
 * 定义ElementUI组件
 */


const firstCategoryFormRef = ref(ElForm);
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



const queryParams1 = reactive<FirstCategoryQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<FirstCategoryPageVO[]>();

const formData1 = reactive<FirstCategoryForm>({
});

const rules = reactive({
  fname: [{ required: true, message: "类别名不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],

});



/**
 * watchEffect会监听所引用数据类型的所有属性（这里监听的是seachDeptName）
 * 满足filter中的value的内容会被保留，其它除去（返回一份新的数据，不影响原来数据）
 */
// watchEffect(
//   () => {
//     deptTreeRef.value.filter(searchDeptName.value);
//   },
//   {
//     flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
//   }
// );


/**
 * 查询
 */

function handleQuery1() {
  loading.value = true;
  getFirstCategoryPage(queryParams1)
    .then(({ data }) => {
      userList1.value = data.list;
      total.value = data.total;
    })

    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */


function resetQuery1() {
  firstCategoryFormRef.value.resetFields();
  queryParams1.pageNum = 1;
  handleQuery1();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}


/**
 * 打开用户弹窗
 */

async function openDialog1(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改";
    getFirstCategoryForm(id).then(({ data }) => {
      Object.assign(formData1, data);
    });
  } else {
    dialog.title = "新增";
  }
}

/**
 * 关闭弹窗
 */

function closeDialog1() {
  dialog.visible = false;
  resetForm1();
}

/**
 * 重置表单
 */


function resetForm1() {
  firstCategoryFormRef.value.resetFields();
  firstCategoryFormRef.value.clearValidate();
  formData1.id = undefined;
}


const handleSubmit1 = useThrottleFn(() => {
  firstCategoryFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateFirstCategoryForm(formData1)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      } else {
       insertFirstCategoryForm(formData1)
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
    deleteFirstCategoryForm(id).then(() => {
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
    <el-row :gutter="20">
      <!-- 搜索栏 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef1" :model="queryParams1" :inline="true">
            
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams1.keywords"
                placeholder="查询一级商品分类"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery1"
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
                <el-button
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="openDialog1()"
                  ><i-ep-plus />新增</el-button
                >
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="danger"
                  :disabled="ids.length === 0"
                  @click="handleDelete1()"
                  ><i-ep-delete />删除</el-button
                >
              </div>

            </div>
          </template>

          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="userList1"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="fname"
              label="一级分类名"
              align="center"
              prop="fname"
            />
            <el-table-column
              label="描述"
              key="description"
              width="120"
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
        ref="firstCategoryFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="类别名" prop="fname">
          <el-input v-model="formData1.fname" placeholder="请输入类别名" />
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

