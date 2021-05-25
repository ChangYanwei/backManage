<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>分类参数</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="selectCategory">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
                  v-model="selectedKeys"
                  :options="categoryList"
                  :props="cascaderProps"
                  @change="categoryChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <el-tab-pane label="动态参数" name="many">
          <!-- 标签页组件 -->
          <param-tab-pane
                  :table-data="manyTableData"
                  :title-text="titleText"
                  :is-btn-disabled="isBtnDisabled"
                  :category-id="categoryId"
                  :active-name="activeName"
                  @param-list="updateParamsList"/>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <param-tab-pane
                  :table-data="onlyTableData"
                  :title-text="titleText"
                  :is-btn-disabled="isBtnDisabled"
                  :category-id="categoryId"
                  :active-name="activeName"
                  @param-list="updateParamsList"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
  // 导入公共组件
  import BreadcrumbNav from "../common/BreadcrumbNav";

  // 导入子组件
  import ParamTabPane from "./paramChildComponents/ParamTabPane";

  import {
    getCategoriesListRequest,
    getCategoryParamsRequest
  } from 'network/goods';

  export default {
    name: "Params",
    components: {
      BreadcrumbNav,
      ParamTabPane
    },
    data() {
      return {
        categoryList: [],
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        selectedKeys: [], // 级联选择框中选中项的数组
        activeName: 'many',
        manyTableData: [], // 动态参数数据
        onlyTableData: [], // 静态属性数据
      }
    },
    created() {
      this.getCategoriesList();
    },
    computed: {
      isBtnDisabled() {
        return this.selectedKeys.length !== 3;
      },
      categoryId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2];
        }
        return null;
      },
      titleText() {
        return this.activeName === 'many' ? '动态参数' : '静态属性';
      }
    },
    methods: {
      getCategoriesList() {
        getCategoriesListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('商品列表获取失败', 'error');
          }

          this.categoryList = result.data;
        })
      },

      // 选择项发送变化触发的函数
      categoryChange() {
        // 只允许选择第三级分类
        let selectedKeys = this.selectedKeys;
        console.log(selectedKeys);
        // 选中的不是三级分类，清空选择项
        if (selectedKeys.length < 3) {
          this.selectedKeys = [];
          return;
        }
        this.getCategoryParams();
      },

      // tab标签页点击事件的处理函数
      handleTabClick() {
        console.log(this.activeName);
        this.getCategoryParams();
      },

      // 获取参数列表
      getCategoryParams() {
        getCategoryParamsRequest(this.categoryId, this.activeName).then(res => {
          let result = res.data;
          console.log('参数：', result);
          if (result.meta.status !== 200) {
            return this.alertMessage('获取参数失败', 'error');
          }

          if (this.activeName === 'many') {
            this.manyTableData = result.data;
          } else {
            this.onlyTableData = result.data;
          }

        })
      },

      // 监听子组件触发的事件
      updateParamsList() {
        this.getCategoryParams();
      },
    }
  }
</script>

<style scoped>
  .selectCategory {
    margin-top: 15px;
  }
</style>
