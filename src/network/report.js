import {request} from "./request";

// 获取基于时间统计的折线图数据
export function getReportData() {
  return request({
    url:'reports/type/1'
  })
}
