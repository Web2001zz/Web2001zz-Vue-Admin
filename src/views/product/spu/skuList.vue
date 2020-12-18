<template>
  <div>
    <el-card>
      <el-form label-width="100px" :model="sku" :rules="rules" ref="skuForm">
        <el-form-item label="SPU名称">
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
            style="width: 200px"
            placeholder="请输入价格"
            v-model="sku.price"
            :min="0"
            :max="9999"
            :precision="2"
            :step="0.1"
          >
          </el-input-number>
        </el-form-item>

        <el-form-item label="重量（千克）" prop="weight">
          <el-input-number
            style="width: 200px"
            placeholder="请输入重量"
            v-model="sku.weight"
            :min="0"
            :max="9999"
            :precision="2"
            :step="0.1"
          >
          </el-input-number>
        </el-form-item>

        <el-form-item label="规格描述" prop="skuDesc">
          <el-input
            type="textarea"
            placeholder="请输入规格描述"
            v-model="sku.skuDesc"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="平台属性" prop="skuAttrValueList">
          <div
            v-for="(attr, index) in attrList"
            :key="attr.id"
            style="display: inline-block; margin: 0 20px"
          >
            <el-form-item
              :label="attr.attrName"
              style="display: inline-block; margin-top: 10px; text-align: right"
            >
              <el-select
                placeholder="请选择"
                v-model="sku.skuAttrValueList[index]"
                @change="clearValidate('skuAttrValueList')"
              >
                <el-option
                  v-for="value in attr.attrValueList"
                  :key="value.id"
                  :label="value.valueName"
                  :value="`${attr.id}~${value.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="销售属性" prop="skuSaleAttrValueList">
          <div
            style="display: inline-block; margin: 0 20px"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-form-item
              :label="saleAttr.saleAttrName"
              style="display: inline-block; text-align: right; margin-top: 10px"
            >
              <el-select
                placeholder="请选择"
                v-model="sku.skuSaleAttrValueList[index]"
                @change="clearValidate('skuSaleAttrValueList')"
              >
                <el-option
                  v-for="sale in saleAttr.spuSaleAttrValueList"
                  :key="sale.id"
                  :label="sale.saleAttrValueName"
                  :value="sale.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="图片列表" prop="skuImageList">
          <el-form-item>
            <el-table
              border
              style="width: 100%; margin: 20px 0"
              :data="imageList"
              ref="imageList"
              @selection-change="handleSelectionChange"
              row-key="id"
            >
              <el-table-column
                width="55"
                type="selection"
                reserve-selection
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
                <template v-slot="{ row }">
                  <el-button
                    v-if="!row.isDefault"
                    @click="setDefault(row.id)"
                    type="primary"
                    size="mini"
                    >设为默认</el-button
                  >
                  <el-tag v-else type="success">默认</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'skuList',
  props: {
    spuItem: Object,
    showList: Function,
  },
  data() {
    return {
      //图片列表
      imageList: [],
      //销售属性数据
      spuSaleAttrList: [],
      //平台属性数据
      attrList: [],
      //spu数据
      spu: this.spuItem,
      //sku数据
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      //校验规则
      rules: {
        //sku名称
        skuName: [
          { required: true, message: '请输入sku名称~', trigger: 'change' },
        ],
        //sku价格
        price: [
          { required: true, message: '请输入商品价格~', trigger: 'change' },
        ],
        //sku重量
        weight: [
          { required: true, message: '请输入商品重量~', trigger: 'change' },
        ],
        //sku描述
        skuDesc: [
          { required: true, message: '请输入sku描述~', trigger: 'change' },
        ],
        //平台属性
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        //销售属性
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        //图片列表
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    }
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //获取平台属性
    async getAttrList() {
      console.log(this.spu)
      const result = await this.$API.attrs.getAttrList(this.category)
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
    //点击图片设置进sku图片列表中
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList
    },
    //平台属性校验规则
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this
      //
      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error('请对所有平台属性进行选择~'))
        return
      }

      callback()
    },
    //销售属性校验规则
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this
      //
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error('请对所有销售属性进行选择~'))
        return
      }

      callback()
    },
    //图片列表校验规则
    skuImageListValidator(rule, value, callback) {
      const { skuImageList } = this.sku
      if (skuImageList.length === 0) {
        callback(new Error('请至少选择一张图片~'))
        return
      }

      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error('请设置一张默认图片~'))
        return
      }
      callback()
    },
    //清除校验失败提示
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop)
    },
    //设置默认图片
    setDefault(id) {
      //图片列表设置默认
      this.clearValidate('skuImageList')

      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        }
      })

      //sku图片列表设置默认
      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        }
      })
    },
    //保存 校验表单 收集数据 发送请求
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          console.log('校验通过')
          //提取spu内的三级分类id、商品id、spuid
          const { category3Id, tmId, id: spuId } = this.spu
          //提取平台属性id与平台属性值的Id
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split('~')
            return {
              attrId,
              valueId,
            }
          })
          //提取销售属性ID与销售属性值ID
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              }
            }
          )
          //提取Sku图片列表中的默认图片Url
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl
          // console.log('sku', this.sku)
          // console.log('id', category3Id, tmId, spuId)
          // console.log('skuAttrValueList', skuAttrValueList)
          // console.log('skuSaleAttrValueList', skuSaleAttrValueList)
          // console.log('skuDefaultImg', skuDefaultImg)
          //发送请求保存sku
          const result = await this.$API.sku.saveSkuInfo({
            ...this.sku,
            category3Id,
            tmId,
            spuId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          })

          if (result.code === 200) {
            this.$message.success('Sku数据保存成功~')
            //跳转
            this.showList()
          } else {
            this.$message.error(result.message)
          }
        }
        /*
            {
              "category3Id": 0, //category
              "id": 0, // 由后台生成
              "isSale": 0,
              "price": 0, // sku.price
              "skuAttrValueList": [  //sku.skuAttrValueList
                {
                  "attrId": 0, // 需处理
                  "id": 0,
                  "skuId": 0,
                  "valueId": 0 //需处理
                }
              ],
              "skuDefaultImg": "string",
              "skuDesc": "string",
              "skuImageList": [
                {
                  "id": 0,
                  "imgName": "string",
                  "imgUrl": "string",
                  "isDefault": "string",
                  "skuId": 0,
                  "spuImgId": 0 // id
                }
              ],
              "skuName": "string",
              "skuSaleAttrValueList": [
                {
                  "id": 0,
                  "saleAttrValueId": 0,
                  "skuId": 0,
                  "spuId": 0
                }
              ],
              "spuId": 0,
              "tmId": 0,
              "weight": "string"
            }
          */
      })
    },
    //取消返回spu界面
    back() {
      this.showList()
    },
  },
  mounted() {
    this.getSpuImageList()
    this.getSpuSaleAttrList()
    this.getAttrList()
  },
  beforeDestroy() {
    this.$store.commit('category/RESET_CATEGORY_ID')
  },
}
</script>

<style lang="less" scoped>
</style>
