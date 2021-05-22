// 权限管理的网络请求

import {request} from "./request";

// 获取权限列表
export function getRightsListRequest(type) {
  return request({
    url: `rights/${type}`
  })
}

// 获取角色列表
export function getRolesListRequest(type) {
  return request({
    url: '/roles'
  })
}

// 添加角色
export function addRoleRequest(roleInfo) {
  return request({
    url: '/roles',
    method: 'post',
    data: {...roleInfo}
  })
}

// 根据角色id获取角色信息
export function getRoleByIdRequest(id) {
  return request({
    url: `roles/${id}`
  })
}

// 编辑角色
export function editRoleRequest(roleInfo) {
  return request({
    url: `roles/${roleInfo.roleId}`,
    method: 'put',
    data: {
      roleName: roleInfo.roleName,
      roleDesc: roleInfo.roleDesc
    }
  })
}

// 编辑角色
export function removeRoleByIdRequest(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

// 为角色添加权限
export function addRightsRequest(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}

// 根据ID删除指定角色下的权限
export function removeRightByIdRequest(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
