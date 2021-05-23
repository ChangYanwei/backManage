<template>
  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParam(attr_id)">删除</el-button>
</template>

<script>
  import {removeParamByIdRequest} from 'network/goods';

  export default {
    name: "ParamRemove",
    props: {
      attr_id: {
        type: Number,
        default: 0
      },
      categoryId: {
        type: Number,
        default: 0
      }
    },
    methods: {
      // 删除参数
      removeParam(attrId) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeParamByIdRequest({
            id: this.categoryId,
            attrId
          }).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('删除失败', 'error');
            }

            this.alertMessage('删除成功', 'success');

            this.$emit('param-list');
            // this.getCategoryParams();
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
