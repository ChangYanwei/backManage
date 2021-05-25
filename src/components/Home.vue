<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div class="header-logo">
        <img src="../assets/logo.png">
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>

    <!--主体-->
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
                background-color="#313743"
                text-color="#fff"
                active-text-color="#409FFF"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="true"
                :default-active="activePath">
          <el-menu-item index="/welcome">
            <i class="el-icon-s-custom"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <!--一级菜单-->
          <el-submenu :index="menu.id + ''" v-for="(menu,menuIndex) in menuList" :key="menu.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <i :class="icons[menuIndex]"></i>
              <span>{{menu.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="subMenu.path" v-for="subMenu in menu.children" :key="subMenu.id"
                          @click="saveNavState(subMenu.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subMenu.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {getMenuListRequest} from "network/home";

  export default {
    name: "Home",
    data() {
      return {
        menuList: [],
        icons: ['iconfont icon-users', 'iconfont icon-tijikongjian', 'iconfont icon-shangpin', 'iconfont icon-danju', 'iconfont icon-baobiao'],
        isCollapse: false,
        activePath: '',// 被激活的链接地址
      }
    },
    created() {
      this.getMenuList();
      let activePath = sessionStorage.getItem('activePath');
      this.activePath = activePath;
    },
    methods: {
      loginOut() {
        sessionStorage.removeItem('token');
        this.$router.replace('/login');
      },
      getMenuList() {
        getMenuListRequest().then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            this.$message({
              message: result.meta.message,
              type: 'error'
            })
          }
          this.menuList = result.data;
        })
      },
      // 点击按钮切换左侧菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      // 保存当前激活的路径
      saveNavState(activePath) {
        // 保存到sessionStorage中是为了在刷新的时候能够取出这个路径并将对应的菜单高亮
        sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
      }
    }
  }
</script>

<style scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: rgb(54, 61, 64);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }

  .header-logo {
    display: flex;
    align-items: center;
  }

  .header-logo img {
    height: 50px;
  }

  /* 左侧菜单 */
  .el-aside {
    background-color: rgb(49, 55, 67);
    color: white;
    user-select: none;
    transition: width 0.3s;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border-right: none;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    letter-spacing: 2px;
    cursor: pointer;
  }

  /* 右侧内容区 */
  .el-main {
    background-color: rgb(233, 237, 241);
  }

</style>
