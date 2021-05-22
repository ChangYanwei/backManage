<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>权限管理</template>
      <template v-slot:secondMenu>角色列表</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <role-add @role-list="updateRoleList" />

      <!-- 角色表格 -->
      <role-table :roles-list="rolesList" @role-list="updateRoleList" />
    </el-card>
  </div>
</template>

<script>

  // 导入公共组件
  import BreadcrumbNav from "../common/BreadcrumbNav";

  // 导入子组件
  import RoleAdd from "./rolesChildComponents/RoleAdd";
  import RoleEdit from "./rolesChildComponents/RoleEdit";
  import RoleRemove from "./rolesChildComponents/RoleRemove";
  import RoleSetRight from "./rolesChildComponents/RoleSetRight";
  import RoleTable from "./rolesChildComponents/RoleTable";

  // 导入发送网络请求的函数
  import {getRolesListRequest} from 'network/rights'

  export default {
    name: "Roles",
    components:{
      BreadcrumbNav,
      RoleAdd,
      RoleEdit,
      RoleRemove,
      RoleSetRight,
      RoleTable
    },
    data() {
      return {
        rolesList: [],
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      // 获取角色列表
      getRolesList() {
        getRolesListRequest().then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取角色列表失败', 'error');
          }
          this.rolesList = result.data;
        })
      },

      // 监听子组件中发出的事件，重新获取角色列表
      updateRoleList(){
        this.getRolesList();
      }
    }
  }
</script>

<style scoped>

</style>
