// 商品管理中的网络请求

import {request} from "./request";

// 商品分类---------------------------

// 获取商品分类的列表
export function getCategoriesListRequest(params) {
  return request({
    url: '/categories',
    params
  })
}

// 添加分类
export function addCategoryRequest(params) {
  return request({
    url: '/categories',
    method: 'post',
    data: {...params}
  })
}

// 根据 id 查询分类
export function getCategoryByIdRequest(id) {
  return request({
    url: `/categories/${id}`
  })
}

// 根据 id 编辑提交分类
export function editCategoryByIdRequest(params) {
  return request({
    url: `/categories/${params.cat_id}`,
    method: 'put',
    data: {
      cat_name: params.cat_name
    }
  })
}

// 根据 id 编辑提交分类
export function removeCategoryByIdRequest(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  })
}

// 分类参数---------------------------
// 获取参数列表
export function getCategoryParamsRequest(id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

// 添加动态参数或者静态属性
export function addParamRequest(params) {
  return request({
    url: `/categories/${params.id}/attributes`,
    method: 'post',
    data: {
      attr_name: params.attr_name,
      attr_sel: params.attr_sel
    }
  })
}

// 根据 ID 查询参数
export function getParamByIdRequest(data) {
  return request({
    url: `/categories/${data.id}/attributes/${data.attrId}`,
    params: {
      attr_sel: data.attr_sel
    }
  })
}

// 根据 ID 修改参数
export function editParamByIdRequest(data) {
  return request({
    url: `/categories/${data.id}/attributes/${data.attrId}`,
    method: 'put',
    data: {
      attr_name: data.attr_name,
      attr_sel: data.attr_sel
    }
  })
}

// 根据 ID 删除参数
export function removeParamByIdRequest(data) {
  return request({
    url: `/categories/${data.id}/attributes/${data.attrId}`,
    method: 'delete'
  })
}

// 商品管理--------------------------------------
// 获取商品列表数据
export function getGoodsListRequest(params) {
  return request({
    url: '/goods',
    params
  })
}

// 根据 ID 删除商品
export function removeGoodsByIdRequest(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

// 添加商品
export function addGoodsRequest(data) {
  return request({
    url: `/goods`,
    method: 'post',
    data
  })
}

