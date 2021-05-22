<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>用户管理</template>
      <template v-slot:secondMenu>用户列表</template>
    </breadcrumb-nav>

    <!-- 卡片视图-->
    <el-card class="box-card">
      <!-- 顶部搜索与添加按钮 -->
      <user-search-and-add :queryInfo="queryInfo" @user-list="updateUserList"/>

      <!-- 展示的表格 -->
      <user-table :user-list="userList" :query-info="queryInfo" @user-list="updateUserList" />

      <!-- 分页 -->
      <user-pagination :query-info="queryInfo" :total="total" @page-size-change="handleSizeChange" @current-page-change="handleSizeChange" />
    </el-card>
  </div>
</template>

<script>

  // 导入公共组件
  import BreadcrumbNav from "../common/BreadcrumbNav";

  // 导入子组件
  import UserSearchAndAdd from "./childComponents/UserSearchAndAdd";
  import UserPagination from "./childComponents/UserPagination";
  import UserTable from "./childComponents/UserTable";

  // 导入发送网络请求的函数
  import {getUserListRequest} from "network/user";

  export default {
    name: "Users",
    components: {
      BreadcrumbNav,
      UserSearchAndAdd,
      UserTable,
      UserPagination
    },
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1, // 当前页
          pagesize: 2 // 每页显示多少条数据
        },
        userList: [],
        total: 0
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      // 获取用户列表
      getUserList() {
        getUserListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取用户列表失败', 'error');
          }
          this.userList = result.data.users;
          this.total = result.data.total;
        })
      },

      // 监听子组件发射的事件，获得最新的userList和total信息
      updateUserList() {
        this.getUserList();
      },

      // 监听pageSize改变的事件，并发送新的网络请求
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },

      // 监听页码改变的事件，并发送新的网络请求
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      }
    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 15px;
  }
</style>
