<template>
  <div class="editDialog">
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(attr_id)">
      编辑
    </el-button>

    <!-- 修改动态参数/静态属性的对话框 -->
    <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getParamByIdRequest,
    editParamByIdRequest
  } from 'network/goods';

  export default {
    name: "ParamEdit",
    props: {
      titleText: {
        type: String,
        default: ""
      },
      attr_id: {
        type: Number,
        default: 0
      },
      categoryId: {
        type: Number,
        default: 0
      },
      activeName: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        editDialogVisible: false,
        editForm: {
          attr_name: ""
        },
        formRules: {
          attr_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      // 点击按钮展示修改的对话框
      showEditDialog(attrId) {
        this.editDialogVisible = true;
        getParamByIdRequest({
          id: this.categoryId,
          attrId,
          attr_sel: this.activeName
        }).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取参数信息失败', 'error');
          }
          this.editForm = result.data;
        })
      },

      // 监听修改对话框的关闭事件
      editDialogClose() {
        this.$refs.editFormRef.resetFields();
      },

      // 修改参数信息
      editParam() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return;
          editParamByIdRequest({
            id: this.categoryId,
            attrId: this.editForm.attr_id,
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            let result = res.data;
            if (result.meta.status !== 200) {
              return this.alertMessage('修改失败', 'error');
            }
            this.alertMessage('修改成功', 'success');
            this.$emit('param-list');
            this.editDialogVisible = false;
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
