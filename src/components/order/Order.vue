<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>订单管理</template>
      <template v-slot:secondMenu>订单列表</template>
    </breadcrumb-nav>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <order-table :order-list="orderList" @order-list="updateOrderList" />

      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5,10,15,20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import BreadcrumbNav from "../common/BreadcrumbNav";

  // 导入子组件
  import OrderTable from "./orderChildComponents/OrderTable";
  import OrderEdit from "./orderChildComponents/OrderEdit";
  import OrderProgress from "./orderChildComponents/OrderProgress";

  import {getOrderListRequest} from 'network/order';

  // 导入静态数据
  import cityData from "./orderData/citydata";

  export default {
    name: "Order",
    components: {
      BreadcrumbNav,
      OrderTable,
      OrderEdit,
      OrderProgress
    },
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        orderList: [],
        total: 0,
        cityData
      }
    },
    created() {
      this.getOrderList();
    },
    methods: {
      getOrderList() {
        getOrderListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取订单列表失败', 'error');
          }
          this.orderList = result.data.goods;
          this.total = result.data.total;
        })
      },

      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },

      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },

      // 监听子组件触发的获取订单列表的事件
      updateOrderList(){
        this.getOrderList();
      }
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>
