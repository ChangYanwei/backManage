<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <slot name="firstMenu">一级菜单</slot>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <slot name="secondMenu">二级菜单</slot>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: "BreadcrumbNav"
  }
</script>

<style scoped>

</style>
