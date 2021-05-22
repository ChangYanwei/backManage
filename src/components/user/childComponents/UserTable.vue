<template>
  <el-table :data="userList" border stripe>
    <!-- 基本信息 -->
    <el-table-column type="index"></el-table-column>
    <el-table-column prop="username" label="姓名"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column prop="role_name" label="角色"></el-table-column>

    <!-- 状态 -->
    <el-table-column label="状态">
      <template slot-scope="scope">
        <user-set-state :state="scope.row.mg_state" :userinfo="scope.row"/>
      </template>
    </el-table-column>

    <!-- 操作 -->
    <el-table-column label="操作" width="180px" class="btns">
      <template slot-scope="scope">
        <!-- 修改按钮 -->
        <user-edit-dialog :user-id="scope.row.id" @user-list="updateUserList"/>

        <!-- 删除按钮 -->
        <user-remove-dialog :user-id="scope.row.id" @user-list="updateUserList"/>

        <!-- 分配角色按钮 -->
        <user-set-role :role="scope.row" @user-list="updateUserList"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  import UserSetState from "./UserSetState";
  import UserEditDialog from "./UserEditDialog";
  import UserRemoveDialog from "./UserRemoveDialog";
  import UserSetRole from "./UserSetRole";

  export default {
    name: "UserTable",
    components: {
      UserSetState,
      UserEditDialog,
      UserRemoveDialog,
      UserSetRole
    },
    props: {
      userList: {
        type: Array,
        default() {
          return []
        }
      },
      queryInfo: {
        type: Object,
        default() {
          return {
            query: '',
            pagenum: 1, // 当前页
            pagesize: 2 // 每页显示多少条数据
          }
        }
      }
    },
    methods: {
      // 监听子组件发射的事件，获得最新的userList和total信息
      updateUserList() {
        this.$emit('user-list');
      }
    }
  }
</script>

<style scoped>

</style>
