<template>
  <div class="editDialog">
    <!-- 修改按钮 -->
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox(orderId)"></el-button>

    <!-- 修改的对话框 -->
    <el-dialog
            title="修改订单数据"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="addressDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="editForm.order_price" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="是否付款">
          <el-radio v-model="editForm.pay_status" label="1">已付款</el-radio>
          <el-radio v-model="editForm.pay_status" label="0">未付款</el-radio>
        </el-form-item>
        <el-form-item label="是否发货">
          <el-radio v-model="editForm.is_send" label="是">是</el-radio>
          <el-radio v-model="editForm.is_send" label="否">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import {getOrderDetailRequest, editOrderRequest} from 'network/order';

  export default {
    name: "OrderEdit",
    props: {
      orderId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        editDialogVisible: false,
        editForm: {
          order_price: 0,
          pay_status: '0',
          is_send: '否'
        },
        editFormRules: {
          order_price: [
            {required: true, message: '请选择省市区/县', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 展示修改地址的对话框
      showBox(id) {
        getOrderDetailRequest(id).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取订单详情失败', 'error');
          }

          this.editForm = result.data;
          this.editDialogVisible = true;
        });
      },

      // 修改订单数据
      editOrder() {
        let editForm = this.editForm;
        editOrderRequest(editForm.order_id, {
          order_price: editForm.order_price,
          pay_status: editForm.pay_status,
          is_send: editForm.is_send === '是' ? '1' : '0'
        }).then(res => {
          let result = res.data;
          if (result.meta.status !== 201) {
            return this.alertMessage('修改失败', 'error');
          }
          this.alertMessage('修改成功', 'success');
          this.$emit('order-list');
          this.editDialogVisible = false;
        })
      },

      // 监听修改地址的对话框关闭事件
      addressDialogClose() {
        this.$refs.editFormRef.resetFields();
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
