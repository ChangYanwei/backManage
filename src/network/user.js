// 用户管理中的网络请求

import {request} from "./request";

// 获取用户列表
export function getUserListRequest(queryInfo) {
  return request({
    url: '/users',
    params: {...queryInfo}
  })
}

// 修改用户状态
export function changUserStateRequest(uid, type) {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put',
  })
}

// 添加新用户
export function addUserRequest(userinfo) {
  return request({
    url: '/users',
    method: 'post',
    data: {...userinfo}
  })
}

// 根据ID查询用户信息
export function getUserByIdRequest(id) {
  return request({
    url: `/users/${id}`
  })
}

// 编辑用户
export function editUserByIdRequest(userInfo) {
  return request({
    url: `/users/${userInfo.id}`,
    method: 'put',
    data: {
      email: userInfo.email,
      mobile: userInfo.mobile
    }
  })
}

// 删除用户
export function removeUserByIdRequest(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 分配用户角色
export function allotNewRoleRequest(userId, roleId) {
  return request({
    url: `users/${userId}/role`,
    method: 'put',
    data: {
      rid: roleId
    }
  })
}
