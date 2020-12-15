<template>
  <div>
    <!-- 选择三级分类列表 -->
    <Categoty :disabled="!isShowList" />
    <!-- 平台属性遍历展示 -->
    <el-card style="margin-top: 30px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus" @click="add"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin: 0 5px"
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 30px" v-show="!isShowList">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        :disabled="!attr.attrName"
        icon="el-icon-plus"
        @click="addAttrValue"
        >添加属性</el-button
      >

      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              size="mini"
              autofocus
              ref="input"
            ></el-input>
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 删除按钮 -->
            <el-popconfirm
              @onConfirm="delAttrValue($index)"
              :title="`您确定删除 ${row.valueName} 吗？`"
              ><el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button
            ></el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Categoty from '@/components/Categoty'
export default {
  name: 'AttrList',
  /*
    属性列表数据的格式
      attrList:Array[4]
        attrName:"1111111111"
        attrValueList:Array[6]
        categoryId:61
        categoryLevel:3
        id:4260
*/
  data() {
    return {
      //平台属性列表
      attrList: [],
      isShowList: true,
      attr: {
        attrName: '',
        attrValueList: [],
      },
      category: {
        // 代表三个分类id数据
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  methods: {
    //在父组件绑定获取所有的属性列表
    async getAttrList(category) {
      this.category = category
      const result = await this.$API.attrs.getAttrList(category)
      if (result.code === 200) {
        this.attrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    //显示添加属性界面
    add() {
      this.isShowList = false
      this.attr.attrName = ''
      this.attr.attrValueList = []
    },
    //切换到编辑页面
    update(attr) {
      //此处改为用深度克隆防止对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr))
    },
    //点击切换编辑模式
    edit(row) {
      //使用set方法将edit变成响应式数据
      this.$set(row, 'edit', true)
      //聚焦
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    //编辑完成
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1)
        return
      }
      row.edit = false
    },
    //添加属性
    addAttrValue() {
      this.attr.attrValueList.push({
        edit: true,
      })
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    //删除属性
    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1)
    },
    //保存数据
    async save() {
      //判断是否添加
      const isAdd = !this.attr.id

      const data = this.attr
      if (isAdd) {
        data.categoryId = this.category.category3Id
        data.categoryLevel = 3
      }
      const result = await this.$API.attrs.saveAttr(data)
      if (result.code == 200) {
        this.$message.success('保存成功')
        this.isShowList = true
        this.getAttrList(this.category)
      } else {
        this.$message.error(result.message)
      }
    },
  },

  mounted() {
    //获取列表
    this.$bus.$on('change', this.getAttrList)
  },
  //使用全局事件总线需要在路由卸载阶段解绑 避免重复绑定事件
  beforeDestroy() {
    this.$bus.$on('change', this.getAttrList)
  },
  components: {
    Categoty,
  },
}
</script>
<style scoped>
</style>
