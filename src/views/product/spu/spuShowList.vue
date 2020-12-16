<template>
  <div>
    <el-card style="margin-top: 30px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$emit('showUpdateList', { category3Id: category.category3Id })"
        :disabled="!category.category3Id"
        >添加SPU</el-button
      >

      <el-table
        :data="spuList"
        v-loading="loading"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', row)"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delSpu(row, row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page="page"
        layout="prev, pager, next, jumper, sizes, total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'spuShowList',
  data() {
    return {
      spuList: [],
      //加载时
      loading: false,
      //分页器用
      page: 1,
      limit: 3,
      total: 0,
      //三级分类
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },

  methods: {
    //获取SPU分页列表
    async getPageList(page, limit) {
      this.loading = true
      const { category3Id } = this.category
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      })
      if (result.code === 200) {
        this.$message.success('获取SPU分页列表成功')

        this.spuList = result.data.records
        this.total = result.data.total
      } else {
        this.$message.error(result.message)
      }
      this.loading = false
    },
    //当三级分类选中后则会触发请求SPU分类列表
    categoryChange(category) {
      this.category = category
      this.getPageList(this.page, this.limit)
    },
    //选中一二级分类后清空列表等
    clearList() {
      this.spuList = []
      this.page = 1
      this.limit = 3
      this.total = 0
      this.category.category3Id = ''
    },
    //删除spu属性
    async delSpu(row, spuId) {
      console.log(row, spuId)
      await this.$API.spu.deleteSpu(spuId)
      this.$bus.$emit('change', this.categoryChange)
    },
  },

  mounted() {
    this.$bus.$on('change', this.categoryChange)
    this.$bus.$on('clearList', this.clearList)
  },
  beforeDestroy() {
    this.$bus.$off('change', this.categoryChange)
    this.$bus.$off('clearList', this.clearList)
  },
}
</script>

<style lang="less" scoped>
</style>
