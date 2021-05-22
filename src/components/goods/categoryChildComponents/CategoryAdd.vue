<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addCategoryDialogClose">
      <el-form :model="addCategoryForm" :rules="categoryFormRules" ref="addCategoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <el-cascader
                  v-model="selectedKeys"
                  :options="parentCategoryList"
                  :props="cascaderProps"
                  @change="parentCategoryChange"
                  clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getCategoriesListRequest,
    addCategoryRequest
  } from 'network/goods';

  export default {
    name: "CategoryAdd",
    data() {
      return {
        addDialogVisible: false, // 控制添加分类对话框的显示与隐藏
        addCategoryForm: {
          cat_name: '',
          cat_pid: 0,// 父级分类的id
          cat_level: 0 // 分类等级
        },
        categoryFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        parentCategoryList: [], // 父级分类列表
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        selectedKeys: [], // 选中的父级分类的ID数组
      }
    },
    methods: {
      // 点击添加分类的按钮，展示对话框
      showAddDialog() {
        this.getParentCategoryList();
        this.addDialogVisible = true;
      },

      // 获取父级分类的列表
      getParentCategoryList() {
        getCategoriesListRequest({type: 2}).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取父级分类数据失败', 'error');
          }

          this.parentCategoryList = result.data;
        })
      },

      // 选择项发送变化触发的函数
      parentCategoryChange() {
        // 如果selectedKeys.length大于0，说明选中了父级分类。等于0，说明没有选择父级分类
        let selectedKeys = this.selectedKeys;
        if (selectedKeys.length > 0) {
          this.addCategoryForm.cat_pid = selectedKeys[selectedKeys.length - 1];
          this.addCategoryForm.cat_level = selectedKeys.length;
          return;
        }
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      },

      // 点击按钮添加新的分类
      addCategory() {
        console.log(this.addCategoryForm);
        this.$refs.addCategoryFormRef.validate(valid => {
          if (!valid) return;

          addCategoryRequest(this.addCategoryForm).then(res => {
            let result = res.data;
            if (result.meta.status !== 201) {
              return this.alertMessage('添加分类失败', 'error');
            }
            this.alertMessage('添加分类成功', 'success');
            this.$emit('category-list');
            this.addDialogVisible = false;
          })
        })
      },

      // 监听对话框的关闭事件，重置表单数据
      addCategoryDialogClose() {
        this.$refs.addCategoryFormRef.resetFields();
        this.selectedKeys = [];
        this.addCategoryForm.cat_level = 0;
        this.addCategoryForm.cat_pid = 0;
      },
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>
