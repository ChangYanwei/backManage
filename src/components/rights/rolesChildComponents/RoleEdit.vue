<template>
  <div class="editDialog">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(roleId)">编辑</el-button>

    <!-- 修改角色的对话框 -->
    <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
      <el-form :model="editRoleForm" :rules="roleFormRules" ref="editRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {
    getRoleByIdRequest,
    editRoleRequest
  } from 'network/rights'

  export default {
    name: "RoleEdit",
    props: {
      roleId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        editDialogVisible: false,
        editRoleForm: {
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
    methods: {
      // 展示编辑角色的弹窗
      showEditDialog(id) {
        this.editDialogVisible = true;
        getRoleByIdRequest(id).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取角色信息失败', 'error');
          }

          this.editRoleForm = result.data;
        })
      },

      // 监听编辑角色的弹框的关闭事件
      editDialogClose() {
        this.$refs.editRoleFormRef.resetFields();
      },

      // 点击编辑角色弹框的“确认”按钮提交
      editRole() {
        this.$refs.editRoleFormRef.validate(valid => {
          if (!valid) return;
          editRoleRequest(this.editRoleForm).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('修改失败', 'error');
            }
            this.alertMessage('修改成功', 'success');

            // 隐藏弹窗
            this.editDialogVisible = false;

            // 重新获取角色列表
            this.$emit('role-list');
          })
        })
      }
    }
  }
</script>

<style scoped>
.editDialog {
  display: inline-block;
  margin-right: 5px;
}
</style>
