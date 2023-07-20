<!-- wangEditor富文本编辑器示例 -->
<script setup lang="ts">
const value = ref("初始内容");
</script>

<template>
  <div class="app-container">
    <el-link
      href="https://gitee.com/JealousDog/GILC/blob/master/src/views/demo/wang-editor.vue"
      type="primary"
      target="_blank"
      class="mb-[20px]"
      >示例源码 请点击>>>></el-link
    >
    <editor v-model="value" style="height: calc(100vh - 180px)" />
  </div>
</template>
