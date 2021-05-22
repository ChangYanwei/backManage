<template>
  <div class="editDialog">
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(id)">编辑</el-button>

    <!-- 编辑的对话框 -->
    <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
      <el-form :model="editCategoryForm" :rules="categoryFormRules" ref="editCategoryFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCategoryByIdRequest,
    editCategoryByIdRequest
  } from 'network/goods';

  export default {
    name: "CategoryEdit",
    props: {
      id: {
        type: Number,
        default: 0
      }

    },
    data() {
      return {
        editDialogVisible: false,
        categoryFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        editCategoryForm: {
          cat_name: ''
        }
      }
    },
    methods: {
      // 编辑
      showEditDialog(id) {
        getCategoryByIdRequest(id).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取信息失败', 'error');
          }

          this.editCategoryForm = result.data;
          this.editDialogVisible = true;
        });
      },

      // 监听编辑的弹框的关闭事件
      editDialogClose() {
        this.$refs.editCategoryFormRef.resetFields();
      },

      // 点击按钮确定编辑
      editCategory() {
        this.$refs.editCategoryFormRef.validate(valid => {
          if (!valid) return;
          editCategoryByIdRequest(this.editCategoryForm).then(res => {
            let result = res.data;
            if (result.meta.status !== 200) {
              return this.alertMessage('修改失败', 'error');
            }
            this.alertMessage('修改成功', 'success');

            // 隐藏弹窗
            this.editDialogVisible = false;

            // 重新获取角色列表
            this.$emit('category-list');
          })
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
