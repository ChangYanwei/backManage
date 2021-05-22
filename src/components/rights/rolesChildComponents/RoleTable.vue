<template>
  <el-table :data="rolesList" border stripe>
    <!-- 展开列 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 展示权限行的子组件 -->
        <role-table-rights-row :scope="scope" />
      </template>
    </el-table-column>

    <!-- 索引列 -->
    <el-table-column type="index"></el-table-column>
    <el-table-column prop="roleName" label="角色名称"></el-table-column>
    <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
    <el-table-column label="操作" width="300px">
      <template slot-scope="scope">
        <!-- 编辑按钮 -->
        <role-edit :role-id="scope.row.id" @role-list="updateRoleList"/>

        <!-- 删除按钮 -->
        <role-remove :role-id="scope.row.id" @role-list="updateRoleList"/>

        <!-- 分配权限的按钮 -->
        <role-set-right :role="scope.row" @role-list="updateRoleList"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import RoleEdit from "./RoleEdit";
  import RoleRemove from "./RoleRemove";
  import RoleSetRight from "./RoleSetRight";
  import RoleTableRightsRow from "./RoleTableRightsRow";

  export default {
    name: "RoleTable",
    props: {
      rolesList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      RoleEdit,
      RoleRemove,
      RoleSetRight,
      RoleTableRightsRow
    },
    methods: {
      // 监听子组件中发出的事件，重新获取角色列表
      updateRoleList() {
        this.$emit('role-list');
      }
    }
  }
</script>

<style scoped>

</style>
