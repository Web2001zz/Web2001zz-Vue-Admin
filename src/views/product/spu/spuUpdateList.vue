<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spu" :rules="rules" ref="spuForm">
        <!-- SPU名称 -->
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>
        <!-- 品牌 -->
        <el-form-item label="品牌" prop="tmId">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="tm in trademarkList"
              :label="tm.tmName"
              :value="tm.id"
              :key="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- SPU描述 -->
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <!-- SPU图片 -->
        <el-form-item label="SPU图片" prop="spuimg">
          <el-upload
            accept="image/*"
            class="avatar-uploader"
            list-type="picture-card"
            :file-list="formatImageList"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!-- 销售属性 -->
        <el-form-item label="销售属性" prop="sale">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.sale"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :label="sale.name"
              :value="`${sale.id}/${sale.name}`"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            :disabled="!spu.sale"
            icon="el-icon-plus"
            @click="addSpuSaleAttr"
            >添加销售属性</el-button
          >
          <!-- 当前销售属性 -->
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>
            <!-- 当前销售属性的销售属性值 -->
            <el-table-column label="属性值列表">
              <template v-slot="{ row, $index }">
                <el-tag
                  @close="delTag(index, row)"
                  style="margin-right: 5px"
                  closable
                  v-for="(attrVal, index) in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-if="row.edit"
                  size="mini"
                  style="width: 100px"
                  @blur="editCompleted(row, $index)"
                  @keyup.enter.native="editCompleted(row, $index)"
                  autofocus
                  ref="input"
                  v-model="saleAttrValueText"
                ></el-input>
                <el-button
                  v-else
                  icon="el-icon-plus"
                  size="mini"
                  @click="edit(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template>
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSale(index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 保存取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="showList(spu.category3Id)">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 预览图片 -->
      <el-dialog :visible.sync="visible">
        <img width="100%" :src="previewImgUrl" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'spuUpdateList',
  props: {
    item: Object,
    showList: Function,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], // 所有图片列表
      previewImgUrl: '', // 预览的图片地址
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // 当前SPU销售属性列表
      saleAttrValueText: '', //正在添加的销售属性值

      //表单校验
      rules: {
        spuName: [{ required: true, message: '请输入SPU名称~' }],
        tmId: [{ required: true, message: '请选择品牌~' }],
        description: [{ required: true, message: '请输入spu描述~' }],
        spuimg: [{ validator: this.imageListValidator, required: true }],
        sale: [{ validator: this.saleValidator, required: true }],
      },
    }
  },
  computed: {
    //SPU属性的图片
    formatImageList() {
      return this.imageList.map((img) => {
        return {
          //新添加的数据不能设置ID 所以只能接UID
          //id一定由后台服务器生成
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        }
      })
    },
    //筛选后的属性列表
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        )
      })
    },
  },
  methods: {
    //获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList()
      if (result.code === 200) {
        this.$message.success('获取所有品牌成功~')
        this.trademarkList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuImageList(id)
      if (result.code === 200) {
        this.$message.success('获取所有图片成功~')
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        this.imageList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    // 获取所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList()
      if (result.code === 200) {
        this.$message.success('获取所有销售属性列表成功~')
        // 处理数据
        this.saleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    //获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu
      const result = await this.$API.spu.getSpuSaleAttrList(id)
      if (result.code === 200) {
        this.$message.success('获取SPU销售属性列表成功~')
        // 处理数据
        this.spuSaleAttrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    //图片预览 放大图
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url
      this.visible = true
    },
    //删除图片 筛选掉点集中的
    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url)
    },
    //图片上传成功 将上传的图片添加到图片列表中
    handleAvatarSuccess(res, file) {
      this.imageList.push({
        imgName: file.name, //文件名称
        imgUrl: res.data, //图片地址
        spuId: this.spu.id, //spudi
      })
    },
    //图片上传前 做格式限制
    beforeAvatarUpload(file) {
      //文件类型
      const imgTypes = ['image/jpg', 'image/png', 'image/jpeg']
      //检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1
      //文件大小
      const isLt = file.size / 1024 < 50

      if (!isValidType) {
        this.$message.error('上传图片LOGO只能是JPG或PNG格式!')
      }
      if (!isLt) {
        this.$message.error('上传品牌LOGO大小不能超过50KB！')
      }
    },
    //选中销售属性
    addSpuSaleAttr() {
      const { sale, id } = this.spu
      //截取字符换返回的是真正的id与属性名
      const [baseSaleAttrId, saleAttrName] = sale.split('/')
      //将销售属性添加到商品中
      this.spuSaleAttrList.push({
        //销售属性id
        baseSaleAttrId: +baseSaleAttrId,
        //销售属性名称
        saleAttrName,
        //SPUID
        spuId: id,
        //销售属性值列表
        spuSaleAttrValueList: [],
      })
      this.spu.sale = ''
    },
    //编辑销售属性值
    edit(row) {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    //将销售属性值添加进到销售属性中
    editCompleted(row, index) {
      //输入销售属性后将其添加进销售属性列表中
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId, //所有销售属性id
          saleAttrName: row.saleAttrName, //所有销售属性名称
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        })

        //修改完成后数据清空
        this.saleAttrValueText = ''
      }

      row.edit = false
    },
    //图片列表表单校验
    imageListValidator(rule, value, callback) {
      //校验成功
      if (this.imageList.length > 0) {
        callback()
        return
      }
      callback(new Error('请至少上传一张图片'))
    },
    //销售属性表单校验
    saleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error('请选择至少一项销售属性~'))
        return
      }

      //判断每一个销售属性是否都至少有一个销售属性值 some方法寻找到true时不会继续寻找
      const isSaleOK = this.spuSaleAttrList.some((sale) => {
        return sale.spuSaleAttrValueList.length === 0
      })
      //某一销售属性没有销售属性值
      if (isSaleOK) {
        callback(new Error('请添加至少一项销售属性值~'))
        return
      }
      //校验成功
      callback()
    },
    //删除单个销售属性值
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    //删除整个销售属性
    delSale(index) {
      this.spuSaleAttrList.splice(index, 1)
    },
    //保存 上传spu 表单校验
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log('校验通过')
          //收集参数
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          }
          const result = await this.$API.spu.updateSpu(spu)

          if (result.code === 200) {
            //成功跳转回spu展示列表
            this.showList(this.spu.category3Id)
            this.$message.success('SPU属性保存成功')
          } else {
            this.$message.error(result.error)
          }
        }
      })
    },
  },
  async mounted() {
    //请求品牌数据
    this.getTrademarkList()
    //请求图片数据
    this.getSpuImageList()
    //请求销售属性列表
    this.getSaleAttrList()
    //获取SPU销售属性列表
    this.getSpuSaleAttrList()
  },
}
</script>

<style lang="less" scoped>
</style>
