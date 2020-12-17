<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />
    <div v-else>
      <!-- 选择三级分类列表 -->
      <Categoty :disabled="!isShowList" />

      <!-- spu属性遍历展示 -->
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        :showSpuList="showSpuList"
      />

      <!-- 更新spu数据展示 -->
      <SpuUpdateList v-else :item="item" :showList="showList" />
    </div>
  </div>
</template>

<script>
import SkuList from './skuList'
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
import Categoty from '@/components/Categoty'
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    }
  },
  methods: {
    //传给sku管理的数据
    showSpuList(row) {
      this.isShowSkuList = true
      this.spuItem = { ...row }
    },
    //展示更新spu列表
    showUpdateList(row) {
      this.isShowList = false
      console.log(row)
      this.item = { ...row } || {}
    },
    //展示spu列表
    showList(category3Id) {
      this.isShowList = true
      //需要等待页面组件加载完成后才能进行调用
      this.$nextTick(() => {
        this.$bus.$emit('change', { category3Id })
      })
    },
  },
  components: {
    Categoty,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
}
</script>
