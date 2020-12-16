<template>
  <div>
    <el-card style="margin-top: 2px">
      <el-button
        type="primary"
        style="margin-bottom: 15px"
        icon="el-icon-circle-plus-outline"
        @click="dialogFormVisible = true"
        >添加新品牌</el-button
      >
      <!-- 添加品牌窗口 -->
      <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="活动名称">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select placeholder="请选择活动区域">
              <el-option label="区域一"></el-option>
              <el-option label="区域二"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!-- Trademark表格 -->
      <el-table :data="pageList" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="address" label="品牌LOGO" align="center">
          <template v-slot="scope">
            <img
              class="trademark-img"
              :src="scope.row.logoUrl"
              alt="logo"
              style="width: 150px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="300" align="center">
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="block" style="margin-top: 20px">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="getPageList(page, $event)"
          @current-change="getPageList($event, limit)"
          :current-page="page"
          :page-sizes="[3, 6, 9]"
          :page-size.sync="limit"
          layout=" prev, pager, next, sizes, total"
          :total="total"
          align="center"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,

      pageList: [],
      //正在加载
      loading: false,
      //添加品牌弹窗是否显示
      dialogFormVisible: false,
    }
  },
  methods: {
    //请求品牌分页列表
    async getPageList(page, limit) {
      this.loading = true
      const result = await this.$API.trademark.getPageList(page, limit)
      if (result.code === 200) {
        this.$message.success('品牌列表数据请求成功~')
        this.pageList = result.data.records
        this.total = result.data.total
        this.limit = result.data.size
        this.page = result.data.current
        console.log(this.pageList)
      } else {
        this.$message.error(result.error)
      }
      this.loading = false
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit)
  },
}
</script>
