

<script  setup lang="ts">
// do not use same name with ref
import {CustomerForm} from "@/api/customerManagement/types";
import {useUserStore} from "@/store/modules/user";
import {addCustomer, getCustomer, updateUser} from "@/api/customerManagement";

const CustomerFormRef=ref(ElForm);
const formDataCustomer = reactive<CustomerForm>({});
const userStore = useUserStore();
//格式规则
const rules = reactive({
	name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
	idcard: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
	address: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
	roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
	work: [{ required: true, message: "工作单位不能为空", trigger: "blur" }],
	postcode: [{ required: true, message: "邮编不能为空", trigger: "blur" }],
	email: [
		{
			pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
			message: "请输入正确的邮箱地址",
			trigger: "blur",
		},
	],
	mobilephone: [
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
	addressephone: [
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
});


const loading = ref(false);
const handleSubmit = useThrottleFn(() => {
	CustomerFormRef.value.validate((valid: any) => {
		if (valid) {
			//const CustomerId = formDataCustomer.id;
			loading.value = true;
			if(formDataCustomer.id==null)
			{
				console.warn("addCustomer")
				addCustomer(formDataCustomer)
				.then(({ data }) => {
					console.warn(data);
					formDataCustomer.id =data.id;
					formDataCustomer.addressphone =data.addressphone;
					formDataCustomer.work =data.work;
					formDataCustomer.address =data.address;
					formDataCustomer.idcard =data.idcard;
					formDataCustomer.mobilephone =data.mobilephone;
					formDataCustomer.postcode =data.postcode;
					formDataCustomer.email =data.email;
					formDataCustomer.name =data.name;
					formDataCustomer.userId=data.userId;
				})
				.finally(() => {
					loading.value = false;
				});
			}else {
				console.warn("updateUser")
				updateUser(formDataCustomer)
				.then(() => {
					ElMessage.success("保存信息成功");
					handleQueryCustomer();
				})
				.finally(() => (loading.value = false));
			}
		}
	});
}, 3000);

function handleQueryCustomer() {
	loading.value = true;
	getCustomer(userStore.userId)
	.then(({ data }) => {
		console.warn(data);
		formDataCustomer.id =data.id;
		formDataCustomer.addressphone =data.addressphone;
		formDataCustomer.work =data.work;
		formDataCustomer.address =data.address;
		formDataCustomer.idcard =data.idcard;
		formDataCustomer.mobilephone =data.mobilephone;
		formDataCustomer.postcode =data.postcode;
		formDataCustomer.email =data.email;
		formDataCustomer.name =data.name;
		formDataCustomer.userId=data.userId;
		sessionStorage.setItem("id", String(data.id));
		sessionStorage.setItem("addressphone", data.addressphone);
		sessionStorage.setItem("work", data.work);
		sessionStorage.setItem("address", data.address);
		sessionStorage.setItem("idcard", data.idcard);
		sessionStorage.setItem("mobilephone", data.mobilephone);
		sessionStorage.setItem("postcode", data.postcode);
		sessionStorage.setItem("name", data.name);
		sessionStorage.setItem("userId", String(data.userId));
	})
	.finally(() => {
		loading.value = false;
	});
}

onMounted(() => {
	handleQueryCustomer()
	formDataCustomer.userId=userStore.userId;
});
</script>
<template>
	<div class="app-container">
		<el-form
				ref="CustomerFormRef"
				:model="formDataCustomer"
				:rules="rules"
				label-width="120px"
				v-loading="loading"
		>
			<el-form-item label="用户名" prop="name">
				<el-input
						v-model="formDataCustomer.name"
						input-style="width: 400px;"
						placeholder="请输入用户名"
				/>
			</el-form-item>
			<el-form-item label="身份证号码" prop="idcard">
				<el-input
						v-model="formDataCustomer.idcard"
						input-style="width: 400px;"
						placeholder="请输入身份证号码"
				/>
			</el-form-item>
			<el-form-item label="地址" prop="address">
				<el-input
						v-model="formDataCustomer.address"
						input-style="width: 400px;"
						placeholder="请输入地址"
				/>
			</el-form-item>
			<el-form-item label="固定电话号码" prop="addressphone">
				<el-input
						v-model="formDataCustomer.addressphone"
						input-style="width: 400px;"
						placeholder="请输入固定电话号码"
				/>
			</el-form-item>

			<el-form-item label="手机号码" prop="mobilephone">
				<el-input
						v-model="formDataCustomer.mobilephone"
						placeholder="请输入手机号码"
						input-style="width: 400px;"
						maxlength="11"
				/>
			</el-form-item>

			<el-form-item label="工作单位" prop="work">
				<el-input
						v-model="formDataCustomer.work"
						input-style="width: 400px;"
						placeholder="请输入工作单位"
				/>
			</el-form-item>
			<el-form-item label="邮编" prop="postcode">
				<el-input
						v-model="formDataCustomer.postcode"

						placeholder="请输入邮编"
						input-style="width: 400px;"
				/>
			</el-form-item>

			<el-form-item label="邮箱" prop="email">
				<el-input
						v-model="formDataCustomer.email"
						placeholder="请输入邮箱"
						input-style="width: 400px;"
						maxlength="50"
				/>
			</el-form-item>
			<el-button style="margin-left: 100px;" type="primary" @click="handleSubmit">保存</el-button>
		</el-form>
	</div>
</template>
