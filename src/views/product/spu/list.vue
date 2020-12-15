<template>
  <div>
    <!-- 选择三级分类列表 -->
    <Categoty />

    <!-- spu属性遍历展示 -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />

    <!-- 更新spu数据展示 -->
    <SpuUpdateList v-else :item="item" :showList="showList" />
  </div>
</template>

<script>
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
import Categoty from '@/components/Categoty'
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      item: {},
    }
  },
  methods: {
    //展示更新spu列表
    showUpdateList(row) {
      this.isShowList = false
      this.item = { ...row }
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
  },
}
</script>
