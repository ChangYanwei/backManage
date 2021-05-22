import {request} from "./request";

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
