<template>
  <div class="editDialog">
    <!-- 修改用户的按钮 -->
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(userId)"></el-button>

    <!-- 修改用户的对话框 -->
    <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {
    getUserByIdRequest,
    editUserByIdRequest,
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
    name: "UserEditDialog",
    props: {
      userId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        editDialogVisible: false,
        editUserForm: {  // 当前准备编辑的用户信息
          username: '',
          email: '',
          mobile: ''
        },
        editUserFormRules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 展示编辑用户的对话框，并获取当前用户的数据
      showEditDialog(id) {
        this.editDialogVisible = true;
        getUserByIdRequest(id).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取用户信息失败','error');
          }
          this.editUserForm = result.data;
        })
      },

      // 监听编辑用户的对话框的关闭事件
      editDialogClose() {
        this.$refs.editUserFormRef.resetFields();
      },

      // 点击编辑用户的“确定”按钮
      editUserInfo() {
        this.$refs.editUserFormRef.validate(valid => {
          if (!valid) return;

          editUserByIdRequest(this.editUserForm).then(res => {
            let result = res.data;
            // 更新失败
            if (result.meta.status !== 200) {
              return this.alertMessage('更新用户信息失败','error');
            }

            // 提示更新成功
            this.alertMessage('更新用户信息成功','success');

            // 关闭对话框
            this.editDialogVisible = false;

            // 重新获取用户列表
            this.$emit('user-list');
          });

        })
      },
    }
  }
</script>

<style scoped>
.editDialog {
  display: inline-block;
  margin-right: 5px;
}
</style>
