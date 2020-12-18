<template>
  <div>
    <!-- 选择三级分类列表 -->
    <el-card>
      <el-form :inline="true" :disabled="disabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="selectChange1"
          >
            <el-option
              :label="c1.name"
              :value="c1.id"
              v-for="c1 in category1List"
              :key="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="selectChange2"
          >
            <el-option
              :label="c2.name"
              :value="c2.id"
              v-for="c2 in category2List"
              :key="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="selectChange3"
          >
            <el-option
              :label="c3.name"
              :value="c3.id"
              v-for="c3 in category3List"
              :key="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'category',
  props: ['disabled'],
  data() {
    return {
      //三级分类数据
      category: {
        //一级分类id
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },

  methods: {
    ...mapMutations(['category/SET_CATEGORY3_ID']),
    ...mapActions([
      'category/getCategory1List',
      'category/getCategory2List',
      'category/getCategory3List',
    ]),
    //输入框的change事件 选择一级分类id获取二级分类
    async selectChange1(category1Id) {
      //当一级分类更新时二三级清空一次
      this.category.category2Id = ''
      this.category.category3Id = ''
      this['category/getCategory2List'](category1Id)
      // this.$bus.$emit('clearList')
    },
    //选择二级分类Id获取三级分类
    async selectChange2(category2Id) {
      //三级分类清空一次
      this.category.category3Id = ''
      this['category/getCategory3List'](category2Id)
      // this.$bus.$emit('clearList')
    },
    //选择三级分类Id时获取属性列表
    async selectChange3(category3Id) {
      this['category/SET_CATEGORY3_ID'](category3Id)
    },
  },

  async mounted() {
    //加载阶段获取一级分类
    this['category/getCategory1List']()
  },
}
</script>

<style lang="less" scoped>
</style>
