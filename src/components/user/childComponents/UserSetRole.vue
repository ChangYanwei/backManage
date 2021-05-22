<template>
  <!-- 分配角色组件 -->
  <div class="setDialog">
    <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
      <el-button type="warning" icon="el-icon-setting" size="mini"
                 @click="showSetRoleDialog(role)"></el-button>
    </el-tooltip>

    <!-- 分配角色的对话框 -->
    <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClose">
      <div>
        <p>当前用户：{{userinfo.username}}</p>
        <p>当前角色：{{userinfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {allotNewRoleRequest} from "network/user";

  import {getRolesListRequest} from 'network/rights'

  export default {
    name: "UserSetRole",
    props: {
      role: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        setRoleDialogVisible: false, // 分配角色的对话框
        userinfo: {}, // 需要被分配角色的用户信息
        rolesList: [], // 角色列表
        selectRoleId: '', // 分配角色时，当前选中的角色id
      }
    },
    methods: {
      // 打开分配角色的弹窗，并获取当前的用户信息
      showSetRoleDialog(role) {
        this.userinfo = role;
        // 获取所有的角色列表
        getRolesListRequest().then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取角色列表失败', 'error');
          }
          this.rolesList = result.data;
        });

        this.setRoleDialogVisible = true;
      },

      // 点击“确定”按钮分配角色
      allotRole() {
        if (!this.selectRoleId) {
          return this.alertMessage('请选择一个角色', 'error');
        }

        allotNewRoleRequest(this.userinfo.id, this.selectRoleId).then(res => {
          let result = res.data;

          // 更新失败
          if (result.meta.status !== 200) {
            return this.alertMessage('更新角色失败', 'error');
          }

          // 提示更新成功
          this.alertMessage('更新角色成功', 'success');

          // 关闭对话框
          this.setRoleDialogVisible = false;

          // 重新获取用户列表
          this.$emit('user-list');
        })
      },

      // 监听分配角色的对话框的关闭事件
      setRoleDialogClose() {
        this.selectRoleId = '';
        this.userinfo = {};
      }
    }
  }
</script>

<style scoped>
  .setDialog {
    display: inline-block;
    margin-left: 5px;
  }
</style>
