<template>
  <div class="setRightDialog">
    <!-- 分配权限的按钮 -->
    <el-button type="warning" icon="el-icon-menu" size="mini" @click="showSetRightDialog(role)">分配权限</el-button>

    <!-- 分配权限的对话框 -->
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="rightDialogClose">
      <!-- 树形空间 -->
      <el-tree
              :data="rightsList"
              :props="treeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="defaultKeys"
              ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRightsListRequest,addRightsRequest} from 'network/rights'

  export default {
    name: "RoleSetRight",
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
        setRightDialogVisible: false,
        rightsList: [], // 权限列表数据
        defaultKeys:[],
        treeProps: { // 树形控件的对象
          label: 'authName',
          children: 'children'
        },
        roleId:'' // 当前要修改的角色的id
      }
    },
    methods: {
      // 展示分配权限的对话框
      showSetRightDialog(role) {
        this.roleId = role.id;

        // 获取所有权限
        getRightsListRequest('tree').then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取权限数据失败', 'error');
          }
          this.rightsList = result.data;

          this.getLeafKeys(role, this.defaultKeys);

          this.setRightDialogVisible = true;
        })
      },

      // 展示分配权限的对话框
      showSetRightDialog(role) {
        this.roleId = role.id;

        // 获取所有权限
        getRightsListRequest('tree').then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取权限数据失败', 'error');
          }
          this.rightsList = result.data;

          this.getLeafKeys(role, this.defaultKeys);

          this.setRightDialogVisible = true;
        })
      },

      // 通过递归的形式，获取角色下的所有三级权限
      getLeafKeys(node, arr) {
        // 如果当前节点不包含children属性，说明是三级权限
        if (!node.children) {
          return arr.push([node.id]);
        }

        node.children.forEach(item => {
          this.getLeafKeys(item, arr);
        })
      },

      // 监听权限对话框的关闭事件
      rightDialogClose() {
        this.defaultKeys = [];
      },

      // 分配权限
      allotRights() {
        // 获得当前选中和被选中的节点
        let keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ];

        let rids = keys.join(',');
        addRightsRequest(this.roleId, rids).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('更新权限失败', 'error');
          }
          this.alertMessage('更新权限成功', 'success');
          this.setRightDialogVisible = false;
          this.$emit('role-list');
        })
      }
    }
  }
</script>

<style scoped>
.setRightDialog {
  display: inline-block;
  margin-left: 5px;
}
</style>
