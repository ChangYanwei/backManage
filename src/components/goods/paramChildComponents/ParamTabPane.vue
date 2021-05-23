<template>
  <div>
    <!-- 添加参数/属性组件 -->
    <param-add
            :title-text="titleText"
            :is-btn-disabled="isBtnDisabled"
            :category-id="categoryId"
            :active-name="activeName"
            @param-list="updateParamsList">
      <template v-slot:title>添加{{titleText}}</template>
    </param-add>

    <el-table :data="tableData" border stripe>
      <!-- 索引列 -->
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮的组件 -->
          <param-edit
                  :title-text="titleText"
                  :attr_id="scope.row.attr_id"
                  :category-id="categoryId"
                  :active-name="activeName"
                  @param-list="updateParamsList"/>
          <!-- 删除按钮的组件 -->
          <param-remove :attr_id="scope.row.attr_id" :category-id="categoryId" @param-list="updateParamsList"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import ParamAdd from "./ParamAdd";
  import ParamEdit from "./ParamEdit";
  import ParamRemove from "./ParamRemove";

  export default {
    name: "ParamTabPane",
    components: {
      ParamAdd,
      ParamEdit,
      ParamRemove
    },
    props: {
      titleText: {
        type: String,
        default: ""
      },
      isBtnDisabled: {
        type: Boolean,
        default: false
      },
      categoryId: {
        type: Number,
        default: 0
      },
      activeName: {
        type: String,
        default: ""
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      updateParamsList() {
        this.$emit('param-list');
      }
    }
  }
</script>

<style scoped>

</style>
