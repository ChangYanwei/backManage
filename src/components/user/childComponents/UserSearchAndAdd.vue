<template>
  <div>
    <!-- 搜索与添加按钮 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 搜索与添加区域 -->
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 添加用户的对话框 -->
    <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getUserListRequest,
    addUserRequest
  } from "network/user";

  // 验证邮箱的规则
  let checkEmail = (rule, value, callback) => {
    let regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    if (!regEmail.test(value)) {
      return callback(new Error('请输入合法的邮箱'));
    }
    callback();
  };

  // 验证手机号的规则
  let checkMobile = (rule, value, callback) => {
    let regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!regMobile.test(value)) {
      return callback(new Error('请输入合法的手机号'));
    }
    callback();
  };

  export default {
    name: "UserSearchAndAdd",
    props: {
      queryInfo: {
        type:Object,
        default() {
          return {
            query: '',
            pagenum: 1, // 当前页
            pagesize: 2 // 每页显示多少条数据
          }
        }
      }
    },
    data() {
      return {
        addDialogVisible: false,
        addUserForm: { // 添加用户表单的数据
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addUserFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 10, message: '长度需要在2到10之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度需要在6到15之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      // 点击搜索按钮时，通知外部组件重新获取用户列表
      search(){
        this.$emit('user-list');
      },

      // 监听弹框的关闭事件
      addDialogClose() {
        this.$refs.addUserFormRef.resetFields();
      },

      // 点击添加用户的“确定”按钮添加新用户
      addUser() {
        this.$refs.addUserFormRef.validate(valid => {
          if (!valid) return;

          addUserRequest(this.addUserForm).then(res => {
            let result = res.data;

            if (result.meta.status !== 201) {
              return this.alertMessage('添加用户失败', 'error');
            }

            this.alertMessage('添加用户成功', 'success');

            // 隐藏弹窗
            this.addDialogVisible = false;

            // 添加新用户，通知外部组件重新获取用户列表
            this.$emit('user-list');
          });

        })
      },
    }
  }
</script>

<style scoped>

</style>
