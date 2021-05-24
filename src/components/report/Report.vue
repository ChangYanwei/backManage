<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>数据统计</template>
      <template v-slot:secondMenu>数据报表</template>
    </breadcrumb-nav>

    <el-card>
      <div id="main" style="width: 750px;height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import BreadcrumbNav from "../common/BreadcrumbNav";
  import * as echarts from 'echarts';

  import {getReportData} from 'network/report';

  export default {
    name: "Report",
    components: {
      BreadcrumbNav
    },
    data() {
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    mounted() {

      let myChart = echarts.init(document.getElementById('main'));
      // 获取基于时间统计的折线图数据
      getReportData().then(res => {
        let result = res.data;
        if (result.meta.status !== 200) {
          return this.alertMessage('获取数据失败', 'error');
        }
        let options = {...this.options, ...result.data};
        myChart.setOption(options);
      })
    }
  }
</script>

<style scoped>

</style>
