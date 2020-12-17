<template>
  <div>
    <el-card>
      <el-form label-width="100px" :model="spu" :rules="rules">
        <el-form-item label="SPU名称" prop="spuName">
          <span>{{ spu.spuName }}</span>
        </el-form-item>

        <el-form-item label="SKU名称" prop="skuName">
          <el-input
            placeholder="请输入SKU名称"
            v-model="sku.skuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="价格（元）" prop="price">
          <el-input-number
            style="width: 150px"
            placeholder="请输入价格"
            v-model="price"
            :min="0"
            :max="9999"
            :precision="2"
            :step="0.1"
          >
          </el-input-number>
        </el-form-item>

        <el-form-item label="重量（千克）">
          <el-input-number
            style="width: 150px"
            placeholder="请输入重量"
            v-model="weight"
            :min="0"
            :max="9999"
            :precision="2"
            :step="0.1"
          >
          </el-input-number>
        </el-form-item>

        <el-form-item label="规格描述">
          <el-input type="textarea" placeholder="请输入规格描述"> </el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <div
            v-for="attr in attrList"
            :key="attr.attrId"
            style="display: inline-block; margin: 0 20px"
          >
            <span>{{ attr.attrName }}</span>
            <el-select placeholder="请选择" v-model="spu.attrId">
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="value.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="销售属性">
          <div
            style="display: inline-block; margin: 0 20px"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <span>{{ saleAttr.saleAttrName }}</span>
            <el-select placeholder="请选择" v-model="spu.spuSaleAttrList">
              <el-option
                v-for="sale in saleAttr.spuSaleAttrValueList"
                :key="sale.id"
                :label="sale.saleAttrValueName"
                :value="sale.Id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            border
            style="width: 100%; margin: 20px 0"
            :data="imageList"
          >
            <el-table-column
              width="55"
              type="selection"
              prop="isCheck"
            ></el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope"
                ><img
                  :src="scope.row.imgUrl"
                  :alt="scope.row.imgName"
                  style="width: 100px; height: 100px"
              /></template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'skuList',
  props: {
    spuItem: Object,
  },
  data() {
    return {
      //spu数据
      spu: this.spuItem,
      /*
          c1Id
          c2Id
          c3Id
        category3Id:61
        description:"人22"
        id:2522
        spuImageList:null
        spuName:"鑫"
        spuSaleAttrList:null
        tmId:245
      */
      //校验规则
      rules: {},
      //图片列表
      imageList: [],
      //sku数据
      sku: {},
      //销售属性数据
      spuSaleAttrList: [],
      //平台属性数据
      attrList: [],
      //价格
      price: 0,
      //重量
      weight: 0,
    }
  },
  methods: {
    //获取平台属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.spu
      console.log(this.spu)
      const result = await this.$API.attrs.getAttrList({
        category1Id,
        category2Id,
        category3Id,
      })
      if (result.code === 200) {
        this.$message.success('平台数据获取成功~')
        this.attrList = result.data
      } else {
        this.$message.error('平台数据获取失败~')
      }
    },
    //获取spu图片列表
    async getSpuImageList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuImageList(id)
      if (result.code === 200) {
        this.$message.success('图片列表获取成功')
        //console.log(result)
        /*
          data: Array(2)
              0: {id: 12579, spuId: 2279, imgName: "11.jpg", imgUrl: "http://182.92.128.115:8080/group1/M00/00/B5/rBFUDF_YlymAYkjGAAAmx63VJ0w760.jpg"}
              1: {id: 12580, spuId: 2279, imgName: "logo.jpg", imgUrl: "http://182.92.128.115:8080/group1/M00/00/B9/rBFUDF_Yz2OAMlNVAAAiKDOH2ZQ412.jpg"}
            length: 2
        */
        this.imageList = result.data
      } else {
        this.$message.error('图片列表获取失败~')
      }
    },
    //获取销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      console.log(result)
      if (result.code === 200) {
        this.$message.success('销售属性列表获取成功~')
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error('销售属性列表获取失败~')
      }
    },
  },
  mounted() {
    this.getSpuImageList()
    this.getSpuSaleAttrList()
    this.getAttrList()
  },
}
</script>

<style lang="less" scoped>
</style>
