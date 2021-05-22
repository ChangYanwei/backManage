<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>权限管理</template>
      <template v-slot:secondMenu>权限列表</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

  import BreadcrumbNav from "../common/BreadcrumbNav";

  import {getRightsListRequest} from "network/rights";

  export default {
    name: "Rights",
    components:{
      BreadcrumbNav
    },
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this.getRightsList();
    },
    methods: {
      getRightsList() {
        getRightsListRequest('list').then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            this.$message({
              message: "获取权限列表失败",
              type: "error"
            });
            return;
          }
          this.rightsList = result.data;
        })
      }
    }
  }
</script>

<style scoped>

</style>
