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

//TODO: inheritAttrs是干嘛的？

import {moneyPageVO, MoneyQuery} from "@/api/financial/types";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

/**
 * 导入UI
 */
import { UploadFile } from "element-plus";
import {getMoney} from "@/api/financial";


/**
 * 定义ElementUI组件
 */

const queryFormRef = ref(ElForm); // 查询表单

const userFormRef = ref(ElForm); // 用户表单

/**
 * ref本质也是reactive，ref(obj)等价于reactive({value: obj}) : 用于定义响应式变量
 * 定义所需变量
 * loading : 反馈是否数据加载完成
 * TODO:
 * ids : ?
 * total : ?
 * dalog : ? 弹窗
 * queryParams : ?
 * moneyPageVO : 对应用户表中的数据
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

const queryParams = reactive<MoneyQuery>({
  pageNum: 1,
  pageSize: 10,
	endTime : new Date(2000, 10, 10, 10, 10),
	startTime : new Date(2000, 10, 11, 10, 10),
});
/*日期选择器，绑定日期*/
const { endTime,startTime } = toRefs(queryParams);
const value1 = ref({
	endTime : endTime.value,
	startTime : startTime.value,
});
//日期选择器
const shortcuts = [
	{
		text: 'Last week',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		},
	},
	{
		text: 'Last month',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		},
	},
	{
		text: 'Last 3 months',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		},
	},
]

const moneyList = ref<moneyPageVO[]>();


const formData = reactive<UserForm>({
  status: 1,
});

const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

const searchDeptName = ref();
const deptList = ref<OptionType[]>();
const roleList = ref<OptionType[]>();
const importDialog = reactive<DialogOption>({
  title: "用户导入",
  visible: false,
});

/**
 * 导入选择的部门ID
 */
const importDeptId = ref<number>();
const excelFile = ref<File>();
const excelFilelist = ref<File[]>([]);

/**
 * 部门筛选
 */
function handleDeptFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  // !==就是!= 这里是在判断，data数据中是否有叫value的部门
  return data.label.indexOf(value) !== -1;
}


/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
	getMoney(queryParams)
    .then(({ data }) => {
			moneyList.value = data.list;
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
  queryParams.deptId = undefined;
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 支付金额
 */
function pay(row: { [key: string]: any }) {
	ElMessageBox.confirm(
			'将跳转到支付宝支付，请确认本次支付',
			'确认支付',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'info',
			}
	)
	.then(() => {
		updateUserPassword( ).then(() => {
			ElMessage({
				type: 'success',
				message: '支付成功',
			})		});

	})
	.catch(() => {
		ElMessage({
			type: 'info',
			message: '支付关闭',
		})
	})
}

/**
 * 打开用户弹窗
 */
async function openDialog(userId?: number) {
  await getDeptOptions();
  await getRoleOptions();
  dialog.visible = true;
  if (userId) {
    dialog.title = "修改用户";
    getUserForm(userId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增用户";
  }
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/**
 * 表单提交
 */
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        updateUser(userId, formData)
          .then(() => {
            ElMessage.success("修改用户成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addUser(formData)
          .then(() => {
            ElMessage.success("新增用户成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);


/**
 * 下载导入模板
 */
function downloadTemplate() {
  downloadTemplateApi().then((response: any) => {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob); // 下载链接
    a.href = href;
    a.download = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击下载
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

/**
 * 打开导入弹窗
 */
async function openImportDialog() {
  await getDeptOptions();
  importDeptId.value = undefined;
  importDialog.visible = true;
}

/**
 * Excel文件change事件
 *
 * @param file
 */
function handleExcelChange(file: UploadFile) {
  if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
    ElMessage.warning("上传Excel只能为xlsx、xls格式");
    excelFile.value = undefined;
    excelFilelist.value = [];
    return false;
  }
  excelFile.value = file.raw;
}

/**
 * 导入用户提交
 */
function handleUserImport() {
  if (importDeptId.value) {
    if (!excelFile.value) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    importUser(importDeptId.value, excelFile.value).then((response) => {
      ElMessage.success(response.data);
      closeImportDialog();
      resetQuery();
    });
  }
}

/**
 * 关闭导入弹窗
 */
function closeImportDialog() {
  importDialog.visible = false;
  excelFile.value = undefined;
  excelFilelist.value = [];
}

/**
 * 导出用户
 */
function handleUserExport() {
  exportUser(queryParams).then((response: any) => {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob); // 下载的链接
    a.href = href;
    a.download = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击导出
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});



</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 搜索栏 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="分站名称" >
              <el-input
                v-model="queryParams.station"
                placeholder="中山分站"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

						<el-form-item label="选择日期">
						<el-date-picker
								v-model="value1"
								type="datetimerange"
								:shortcuts="shortcuts"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
						/>
						</el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
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
                <el-dropdown split-button>
                  导入
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="downloadTemplate">
                        <i-ep-download />下载模板</el-dropdown-item
                      >
                      <el-dropdown-item @click="openImportDialog">
                        <i-ep-top />导入数据</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button class="ml-3" @click="handleUserExport"
                  ><template #icon><i-ep-download /></template>导出</el-button
                >
              </div>
            </div>
          </template>

          <!-- 表单开始位置 -->

          <el-table
            v-loading="loading"
            :data="moneyList"
            @selection-change="handleSelectionChange">				<!-- 应该是导出用的-->
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              label="商品类别"
              align="center"
              prop="goodClass"
            />
            <el-table-column
              label="商品名称"
              width="120"
              align="center"
              prop="goodName"
            />

            <el-table-column
              label="送货数量"
              width="100"
              align="center"
              prop="goodGetNumber"
            />

            <el-table-column
              label="收款额"
              width="120"
              align="center"
              prop="goodGetMoney"
            />
            <el-table-column
              label="退回数量"
              align="center"
              prop="goodReturnNumber"
              width="120"
            />
						<el-table-column
								label="退款额"
								align="center"
								prop="goodReturnMoney"
								width="120"
						/>

            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['sys:user:reset_pwd']"
                  type="primary"
                  size="small"
                  link
                  @click="resetPassword(scope.row)"
                  ><i-ep-refresh-left />支付</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 表单结束位置 -->

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
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
      @close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptList"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog
      v-model="importDialog.visible"
      :title="importDialog.title"
      width="600px"
      append-to-body
      @close="closeImportDialog"
    >
      <el-form label-width="80px">
        <el-form-item label="部门">
          <el-tree-select
            v-model="importDeptId"
            placeholder="请选择部门"
            :data="deptList"
            filterable
            check-strictly
          />
        </el-form-item>

        <el-form-item label="Excel">
          <el-upload
            class="upload-demo"
            action=""
            drag
            :auto-upload="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :file-list="excelFilelist"
            :on-change="handleExcelChange"
            :limit="1"
          >
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">xls/xlsx files</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUserImport">确 定</el-button>
          <el-button @click="closeImportDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
