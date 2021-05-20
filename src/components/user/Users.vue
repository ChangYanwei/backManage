<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>

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
    getUserListRequest,
    changUserStateRequest,
    addUserRequest,
    getUserByIdRequest,
    editUserByIdRequest,
    removeUserByIdRequest
  } from "network/user";

  export default {
    name: "Users",
    data() {

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

      return {
        queryInfo: {
          query: '',
          pagenum: 1, // 当前页
          pagesize: 2 // 每页显示多少条数据
        },
        userList: [],
        total: 0,
        addDialogVisible: false, // 控制添加用户对话框的显示与隐藏
        editDialogVisible: false, // 控制修改用户对话框的显示与隐藏
        addUserForm: { // 添加用户表单的数据
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addUserFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度需要在3到10之间', trigger: 'blur'}
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
    created() {
      this.getUserList();
    },
    methods: {
      // 获取用户列表
      getUserList() {
        getUserListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            this.$message({
              message: '获取用户列表失败',
              type: 'error'
            })
          }
          this.userList = result.data.users;
          this.total = result.data.total;
        })
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
      },

      // switch状态改变
      userStateChange(userinfo) {
        changUserStateRequest(userinfo.id, userinfo.mg_state).then(res => {
          let result = res.data;
          console.log('修改状态', result);
          if (result.meta.status !== 200) {
            this.$message({
              message: "更新状态失败",
              type: "error"
            });
            userinfo.mg_state = !userinfo.mg_state;
            return;
          }
          this.$message({
            message: result.meta.msg,
            type: "success"
          });
        })
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
              this.$message({
                message: '添加用户失败',
                type: 'error'
              });
              return;
            }

            this.$message({
              message: '添加用户成功',
              type: 'success'
            });
          });

          // 隐藏弹窗
          this.addDialogVisible = false;
          // 重新获取用户列表
          this.getUserList();
        })
      },

      // 展示编辑用户的对话框，并获取当前用户的数据
      showEditDialog(id) {
        this.editDialogVisible = true;
        getUserByIdRequest(id).then(res => {
          let result = res.data;
          console.log('用户信息', result);
          if (result.meta.status !== 200) {
            this.$message({
              message: '获取用户信息失败',
              type: 'error'
            });
            return;
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
            console.log('编辑用户', result);
            // 更新失败
            if (result.meta.status !== 200) {
              this.$message({
                message: '更新用户信息失败',
                type: 'error'
              });
              return;
            }
          });

          // 提示更新成功
          this.$message({
            message: '更新用户信息成功',
            type: 'success'
          });

          // 关闭对话框
          this.editDialogVisible = false;
          // 重新获取用户列表
          this.getUserList();
        })
      },

      // 根据ID删除用户
      removeUserById(id) {
        this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUserByIdRequest(id).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              this.$message({
                message: '删除失败',
                type: 'error'
              });
              return;
            }

            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            this.getUserList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }

    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 15px;
  }
</style>
