<template>
  <div>
    <!-- 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 添加角色的对话框 -->
    <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
      <el-form :model="addRoleForm" :rules="roleFormRules" ref="addRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {addRoleRequest} from 'network/rights'
  export default {
    name: "RoleAdd",
    data() {
      return {
        addDialogVisible:false,
        addRoleForm: {
          roleName: '',
          roleDesc: ''
        },
        roleFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度需要在2到10之间', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 3, max: 20, message: '长度需要在3到20之间', trigger: 'blur'}
          ],
        },
      }
    },
    methods:{
      // 添加角色
      addRole() {
        this.$refs.addRoleFormRef.validate(valid => {
          if (!valid) return;

          addRoleRequest(this.addRoleForm).then(res => {
            let result = res.data;
            if (result.meta.status !== 201) {
              return this.alertMessage('添加角色失败', 'error');
            }
            this.alertMessage('添加角色成功', 'success');

            // 隐藏弹窗
            this.addDialogVisible = false;

            // 重新获取角色列表
            this.$emit('role-list');
          })
        })
      },

      // 监听添加角色的弹框的关闭事件
      addDialogClose() {
        this.$refs.addRoleFormRef.resetFields();
      },
    }
  }
</script>

<style scoped>

</style>
