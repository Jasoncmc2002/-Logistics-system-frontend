<script setup lang="ts">

defineOptions({
  name: "supply",
  inheritAttrs: false,
});


import {
  insertSupplyForm,
  deleteSupplyForm,
  getSupplyPage,
  getSupplyForm,
  updateSupplyForm
} from "@/api/supply";


import {SupplyPageVO,SupplyForm,SupplyQuery } from "@/api/supply/types";


const supplyFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
});



const queryParams1 = reactive<SupplyQuery>({
  pageNum: 1,
  pageSize: 10,
});
const userList1 = ref<SupplyPageVO[]>();

const formData1 = reactive<SupplyForm>({
});

const rules = reactive({
  name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
  address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
  adminName: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "电话号不能为空", trigger: "blur" }],
  bank: [{ required: true, message: "开户银行不能为空", trigger: "blur" }],
  bankNumer: [{ required: true, message: "银行卡号不能为空", trigger: "blur" }],
  fax: [{ required: true, message: "传真不能为空", trigger: "blur" }],
  postcode: [{ required: true, message: "邮编不能为空", trigger: "blur" }],
  legalPerson: [{ required: true, message: "法人不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
  // description: [{ required: true, message: "描述不能为空", trigger: "blur" }],

});




function handleQuery1() {
  loading.value = true;
  getSupplyPage(queryParams1)
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
 //supplyFormRef.value.resetFields();
	queryParams1.nameKeywords=null;
	queryParams1.addrKeywords=null;
	queryParams1.adminKeywords=null;
	queryParams1.telKeywords=null;
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
    getSupplyForm(id).then(({ data }) => {
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
 supplyFormRef.value.resetFields();
 supplyFormRef.value.clearValidate();
  formData1.id = undefined;
}


const handleSubmit1 = useThrottleFn(() => {
 supplyFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData1.id;
      loading.value = true;
      if (userId) {
        updateSupplyForm(formData1)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog1();
            resetQuery1();
          })
          .finally(() => (loading.value = false));
      } else {
       insertSupplyForm(formData1)
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
    deleteSupplyForm(id).then(() => {
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
            
            <el-form-item label="供应商名称" prop="nameKeywords">
              <el-input
                v-model="queryParams1.nameKeywords"
                placeholder="输入供应商名称"
                clearable
                style="width: 200px"
      
              />
            </el-form-item>
            <el-form-item label="地址" prop="addrKeywords">
              <el-input
                v-model="queryParams1.addrKeywords"
                placeholder="输入地址"
                clearable
                style="width: 200px"
          
              />
            </el-form-item>
            <el-form-item label="联系人" prop="adminKeywords">
              <el-input
                v-model="queryParams1.adminKeywords"
                placeholder="输入联系人"
                clearable
                style="width: 200px"
              
              />
            </el-form-item>
            <el-form-item label="电话号码" prop="telKeywords">
              <el-input
                v-model="queryParams1.telKeywords"
                placeholder="输入电话号码"
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
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="name"
              label="供应商名"
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
              label="联系人"
              key="adminName"
              width="120"
              align="center"
              prop="adminName"
            />
            <el-table-column
              label="电话号码"
              key="phone"
              width="120"
              align="center"
              prop="phone"
            />
            <el-table-column
              label="开户银行"
              key="bank"
              width="120"
              align="center"
              prop="bank"
            />
            <el-table-column
              label="银行卡号"
              key="bankNumer"
              width="120"
              align="center"
              prop="bankNumer"
            />
            <el-table-column
              label="传真"
              key="fax"
              width="120"
              align="center"
              prop="fax"
            />
            <el-table-column
              label="邮编"
              key="postcode"
              width="120"
              align="center"
              prop="postcode"
            />
            <el-table-column
              label="法人"
              key="legalPerson"
              width="120"
              align="center"
              prop="legalPerson"
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
        ref="supplyFormRef"
        :model="formData1"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="供应商姓名" prop="name">
          <el-input v-model="formData1.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData1.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="adminName">
          <el-input v-model="formData1.adminName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="供应商电话号码" prop="phone">
          <el-input v-model="formData1.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input v-model="formData1.bank" placeholder="开户银行" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankNumer">
          <el-input v-model="formData1.bankNumer" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="formData1.fax" placeholder="请输入传真" />
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="formData1.postcode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="formData1.legalPerson" placeholder="请输入法人" />
        </el-form-item>
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

