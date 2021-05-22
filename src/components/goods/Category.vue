<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>商品分类</template>
    </breadcrumb-nav>

    <!-- 卡片视图区域 -->
    <category-card />
  </div>
</template>

<script>
  // 导入公共组件
  import BreadcrumbNav from "../common/BreadcrumbNav";

  // 导入子组件
  import CategoryCard from "./categoryChildComponents/CategoryCard";

  export default {
    name: "GoodsCategory",
    components: {
      BreadcrumbNav,
      CategoryCard
    }
  }
</script>

<style scoped>

</style>
