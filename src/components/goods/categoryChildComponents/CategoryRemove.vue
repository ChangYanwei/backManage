<template>
  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCategory(id)">删除</el-button>
</template>

<script>
  import {removeCategoryByIdRequest} from 'network/goods';

  export default {
    name: "CategoryRemove",
    props: {
      id: {
        type: Number,
        default: 0
      }
    },
    methods: {
      removeCategory(id) {
        this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeCategoryByIdRequest(id).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('删除失败', 'error');
            }

            this.alertMessage('删除成功', 'success');

            this.$emit('category-list');
          });
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      }
    }
  }
</script>

<style scoped>

</style>
