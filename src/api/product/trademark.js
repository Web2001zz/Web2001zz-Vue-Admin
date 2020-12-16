import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  //  获取品牌列表 GET /admin/product/baseTrademark/getTrademarkList
  getTrademarkList () {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: 'GET',
    })
  },
  //  删除品牌 DELETE /admin/product/baseTrademark/remove/{id}
  delTrademark (id) {
    return request({
      url: `${api_name}/baseTrademark/remove/${id}`,
      method: 'DELETE',
    })
  },
  // 添加品牌 POST /admin/product/baseTrademark/save
  addTrademark (data) {
    return request({
      url: `${api_name}/baseTrademark/save`,
      method: 'POST',
      data,
    })
  },
  // 修改品牌数据 PUT /admin/product/baseTrademark/update
  UpdateTrademark ({ id, logoUrl, tmName }) {
    return request({
      url: `${api_name}/baseTrademark/update`,
      method: 'PUT',
      data: { id, logoUrl, tmName }
    })
  },
  // 分页获取品牌列表 GET /admin/product/baseTrademark/{page}/{limit}
  getPageList (page, limit) {
    return request({
      url: `${api_name}/baseTrademark/${page}/${limit}`,
      method: 'GET',
    })
  },
}
