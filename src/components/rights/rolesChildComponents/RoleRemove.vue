<template>
  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(roleId)">删除</el-button>
</template>

<script>
  import {removeRoleByIdRequest} from 'network/rights'

  export default {
    name: "RoleRemove",
    props: {
      roleId: {
        type: Number,
        required: true
      }
    },
    methods: {
      // 根据ID删除用户
      removeRoleById(id) {
        this.$confirm('此操作将删除该该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRoleByIdRequest(id).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('删除失败', 'error');
            }

            this.alertMessage('删除成功', 'success');

            this.$emit('role-list');
          });
        }).catch(() => {
          this.alertMessage('已取消删除','info');
        });
      }
    }
  }
</script>

<style scoped>

</style>
