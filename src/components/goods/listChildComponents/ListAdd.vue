<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>添加商品</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                      v-model="addForm.goods_cat"
                      :options="categoryList"
                      :props="categoryProps"
                      @change="handleCascaderChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(tag,index) in item.attr_vals" :label="tag"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片上传的地址 -->
            <el-upload
                    :action="uploadUrl"
                    :on-preview="handleImgPreview"
                    :on-remove="handleImgRemove"
                    list-type="picture"
                    :headers="imgUploadHeaders"
                    :on-success="handleImgUploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce" class="editor"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!-- 图片预览弹窗 -->
    <el-dialog
            title="图片预览"
            :visible.sync="previewDialogVisible"
            width="50%">
      <img :src="previewImgUrl" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import BreadcrumbNav from "../../common/BreadcrumbNav";

  import {getCategoriesListRequest, getCategoryParamsRequest, addGoodsRequest} from 'network/goods';

  export default {
    name: "ListAdd",
    components: {
      BreadcrumbNav
    },
    data() {
      return {
        activeIndex: '0',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',// 商品的详情
          attrs: []
        },
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ]
        },
        categoryList: [],
        categoryProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        manyTableData: [],
        onlyTableData: [],
        // uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
        uploadUrl: "https://www.liulongbin.top:8888/api/private/v1",
        imgUploadHeaders: { // 上传图片控件的header
          Authorization: sessionStorage.getItem('token')
        },
        previewImgUrl: '',
        previewDialogVisible: false
      }
    },
    computed: {
      // 三级分类的id
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2];
        }
        return null;
      }
    },
    created() {
      this.getCategoriesList();
    },
    methods: {
      getCategoriesList() {
        getCategoriesListRequest({}).then(res => {
          let result = res.data;
          console.log('商品分类', result);
          if (result.meta.status !== 200) {
            return this.alertMessage('获取分类列表失败', 'error');
          }
          this.categoryList = result.data;
        })
      },

      // 级联选择器的选择项发生变化
      handleCascaderChange() {
        console.log(this.addForm.goods_cat);
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = [];
        }
      },

      // tab标签页发生切换
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.alertMessage('请先选择商品分类', 'error');
          return false;
        }
      },

      // 点击切换左侧标签页
      tabClicked() {
        // 访问的是商品参数面板
        if (this.activeIndex === '1') {
          getCategoryParamsRequest(this.cateId, 'many').then(res => {
            let result = res.data;
            if (result.meta.status !== 200) {
              return this.alertMessage('获取商品参数失败', 'error');
            }

            this.manyTableData = result.data;
            result.data.forEach(item => {
              item.attr_vals = item.attr_vals.split(' ');
            });
            console.log('商品参数：', result.data);
          })
        } else if (this.activeIndex === '2') {
          // 访问的是 商品属性 面板
          getCategoryParamsRequest(this.cateId, 'only').then(res => {
            let result = res.data;
            if (result.meta.status !== 200) {
              return this.alertMessage('获取商品参数失败', 'error');
            }

            this.onlyTableData = result.data;
            console.log('商品属性：', result.data);
          })
        }
      },

      // 处理图片预览效果
      handleImgPreview(file) {
        console.log('预览', file);
        this.previewImgUrl = file.response.data.url;
        this.previewDialogVisible = true;
      },

      // 处理移除图片的操作
      handleImgRemove(file) {
        // file表示将要被移除的文件
        console.log('将要被移除的文件:', file);
        let removeUrl = file.response.data.tmp_path;
        let index = this.addForm.pics.findIndex(item => {
          return item.tmp_path === removeUrl;
        });
        this.addForm.pics.splice(index, 1);
        console.log(this.addForm);
      },

      // 监听图片上传成功
      handleImgUploadSuccess(response) {
        let picInfo = {
          pic: response.data.tmp_path
        };
        this.addForm.pics.push(picInfo);
      },

      // 点击按钮添加商品
      addGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.alertMessage('请填写必要的表单项', 'error');
          }

          // 处理动态参数和静态属性
          this.manyTableData.forEach(item => {
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            };
            this.addForm.attrs.push(newInfo);
          });

          this.onlyTableData.forEach(item => {
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(newInfo);
          });

          let addDeepForm = JSON.parse(JSON.stringify(this.addForm));
          addDeepForm.goods_cat = addDeepForm.goods_cat.join(',');
          console.log(addDeepForm);

          addGoodsRequest(addDeepForm).then(res => {
            let result = res.data;
            console.log('添加商品', result);
            if (result.meta.status !== 201) {
              return this.alertMessage('添加失败', 'error');
            }
            this.alertMessage('添加成功', 'success');
            this.$router.push('/goods');
          })
        })
      }
    }
  }
</script>

<style scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .addBtn {
    margin-top: 15px;
  }
</style>
