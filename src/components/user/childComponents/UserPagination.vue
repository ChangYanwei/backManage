<template>
  <div>
    <!-- 分页 -->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "UserPagination",
    props: {
      queryInfo: {
        type: Object,
        default() {
          return {
            query: '',
            pagenum: 1, // 当前页
            pagesize: 2 // 每页显示多少条数据
          }
        }
      },
      total: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    },
    methods: {
      // 监听pageSize改变的事件，并发送新的网络请求
      handleSizeChange(newSize) {
        // this.queryInfo.pagesize = newSize;
        // this.getUserList();
        this.$emit('page-size-change', newSize);
      },

      // 监听页码改变的事件，并发送新的网络请求
      handleCurrentChange(newPage) {
        // this.queryInfo.pagenum = newPage;
        // this.getUserList();
        this.$emit('current-page-change', newPage);
      }
    }
  }
</script>

<style scoped>

</style>
