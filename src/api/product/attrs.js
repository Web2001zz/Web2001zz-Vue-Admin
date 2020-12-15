import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  //获取一级分类列表
  getCategorys1 () {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    })
  },

  //获取二级分类列表
  getCategorys2 (category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    })
  },

  //获取三级分类列表
  getCategorys3 (category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    })
  },
  //获取所有属性分类列表
  //GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getAttrList ({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    })
  },

  //删除属性 DELETE /admin/product/deleteAttr/{attrId}
  delAttr (attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    })
  },

  //保存属性 POST /admin/product/saveAttrInfo
  saveAttr (attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    })
  },

  //获取属性的属性值列表 GET /admin/product/getAttrValueList/{attrId}
  getAttrValueList (attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    })
  }
}
