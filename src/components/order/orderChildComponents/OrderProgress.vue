<template>
  <div class="progressDialog">
    <el-button type="success" size="mini" icon="el-icon-location" @click="progressDialogVisible = true"></el-button>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
            title="物流进度"
            :visible.sync="progressDialogVisible"
            width="50%">
      <el-timeline>
        <el-timeline-item
                v-for="(activity, index) in progressData"
                :key="index"
                :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import progressData from "../orderData/progress";

  export default {
    name: "OrderProgress",
    data() {
      return {
        progressDialogVisible: false,
        progressData
      }
    }
  }
</script>

<style scoped>
  .progressDialog {
    display: inline-block;
  }
</style>
