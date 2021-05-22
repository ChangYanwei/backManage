<template>
  <!-- 表格 -->
  <tree-table
          :data="categoryList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          class="tree-table">
    <!-- 是否有效 -->
    <template slot="isok" slot-scope="scope">
      <i class="el-icon-success checkIcon" v-if="!scope.row.cat_deleted"></i>
      <i class="el-icon-error closeIcon" v-else></i>
    </template>

    <!-- 排序 -->
    <template slot="order" slot-scope="scope">
      <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
      <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
      <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>

    <!-- 操作 -->
    <template slot="opt" slot-scope="scope">
      <category-edit :id="scope.row.cat_id" @category-list="updateCategoryList"/>
      <category-remove :id="scope.row.cat_id" @category-list="updateCategoryList"/>
    </template>
  </tree-table>
</template>

<script>

  import CategoryEdit from "./CategoryEdit";
  import CategoryRemove from "./CategoryRemove";

  export default {
    name: "CategoryTable",
    components:{
      CategoryEdit,
      CategoryRemove
    },
    props: {
      categoryList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        // 为table指定列
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template', // 指定当前列是模板列
            template: 'isok',
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          },
        ]
      }
    },
    methods: {
      updateCategoryList() {
        this.$emit('category-list');
      }
    }
  }
</script>

<style scoped>
  .checkIcon {
    color: lightgreen;
    font-size: 17px;
  }

  .closeIcon {
    color: red;
    font-size: 17px;
  }

  .tree-table {
    margin-top: 15px;
  }
</style>
