<template>
  <div class="login-container">
    <div class="login-box">
      <!--头像-->
      <div class="avatar-box">
        <img src="../assets/logo2.png">
      </div>
      <!--表单-->
      <el-form ref="loginFormRef" :model="loginForm" class="login-form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import {loginRequest} from "network/login";

  export default {
    name: "Login",
    data() {
      return {
        // 登录表单数据
        loginForm: {
          username: "",
          password: ""
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}, // trigger表示什么时候触发，blur表示失去焦点的时候触发
            {min: 3, max: 10, message: '长度需要在3到10之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度需要在6到15之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 点击重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        // 表单登录前的预校验
        this.$refs.loginFormRef.validate(valid => {
          if (!valid) return;
          loginRequest(this.loginForm).then(res => {
            let result = res.data;
            if (result.meta.status !== 200) {
              this.$message({
                message: '登录失败',
                type: 'error'
              });
              return;
            }
            this.$message({
              message: '恭喜，登录成功',
              type: 'success'
            });
            sessionStorage.setItem('token', result.data.token);
            this.$router.push('/home');
          }).catch(err => {
            console.log('登录失败：', err);
          })
        })
      }
    }
  }
</script>

<style scoped>
  .login-container {
    height: 100%;
    background-color: #2b4b6b;
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
  }

  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    margin: 0 auto;
    transform: translateY(-50%);
    background-color: #fff;
  }

  .avatar-box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
