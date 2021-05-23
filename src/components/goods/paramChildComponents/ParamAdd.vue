<template>
  <div>
    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
      <slot name="title">添加参数</slot>
    </el-button>

    <!-- 添加动态参数/静态属性的对话框 -->
    <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addParamRequest} from 'network/goods';

  export default {
    name: "ParamAdd",
    props: {
      titleText: {
        type: String,
        default: ""
      },
      isBtnDisabled: {
        type: Boolean,
        default: false
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
        addDialogVisible:false,
        addForm: { // 添加表单的规则
          attr_name: ""
        },
        formRules: {
          attr_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
      }
    },
    methods:{
      // 监听添加对话框的关闭
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      },

      // 添加参数
      addParam() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return;
          addParamRequest({
            id: this.categoryId,
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            let result = res.data;
            if (result.meta.status !== 201) {
              return this.alertMessage('添加参数失败', 'error');
            }
            this.alertMessage('添加参数成功', 'success');
            this.$emit('param-list');
            this.addDialogVisible = false;
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
