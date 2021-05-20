import {request} from "./request";

// 获取左侧菜单列表
export function getMenuListRequest() {
  return request({
    url: '/menus'
  })
}


