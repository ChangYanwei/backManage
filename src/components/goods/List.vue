<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>商品列表</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import BreadcrumbNav from "../common/BreadcrumbNav";

  import {
    getGoodsListRequest,
    removeGoodsByIdRequest
  } from "network/goods";

  export default {
    name: "List",
    components: {
      BreadcrumbNav
    },
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList() {
        getGoodsListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取商品数据失败', 'error');
          }
          this.goodsList = result.data.goods;
          this.total = result.data.total;
        });
      },

      // 每页显示的数据条数发送变化
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },

      // 当前页码发生变化
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },

      // 删除商品
      removeGoods(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeGoodsByIdRequest(id).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('删除失败', 'error');
            }

            this.alertMessage('删除成功', 'success');

            // this.$emit('param-list');
            this.getGoodsList();
          });
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      },

      // 跳转到添加商品的界面
      goAddPage() {
        this.$router.push('/add');
      }
    }
  }
</script>

<style scoped>

</style>
