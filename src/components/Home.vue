<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods:{
      loginOut() {
        sessionStorage.removeItem('token');
        this.$router.replace('/login');
      }
    }
  }
</script>

<style scoped>

</style>
