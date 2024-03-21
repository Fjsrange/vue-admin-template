<template>
  <div class="">
    <!-- 
      inline：代表的是行内表单，代表的一行可以放置多个表单元素
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择一级分类" v-model="cForm.category1Id" @change="handler1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择二级分类" v-model="cForm.category2Id" @change="handler2">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择三级分类" v-model="cForm.category3Id" @change="handler3">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  components: {},
  data() {
    return {
      list1: [], // 一级分类列表
      list2: [], // 二级分类列表
      list3: [], // 二级分类列表
      cForm: {
        category1Id: '', // 一级分类id
        category2Id: '', // 二级分类id
        category3Id: '', // 三级分类id
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      let res = await this.$API.attr.category1List()
      if (res.code == 200) {
        this.list1 = res.data
      }
    },
    // 一级分类发生变化，获取二级分类的数据
    async handler1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';
      // 解构出一级分类的id
      const { category1Id } = this.cForm
      // 将一级分类的id传递给父组件
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的ID，获取二级分类的数据
      let res = await this.$API.attr.category2List(category1Id)
      if (res.code == 200) {
        this.list2 = res.data
      }
    },
    // 二级分类发生变化，获取三级分类的数据
    async handler2() {
      // 清除数据
      this.list3 = [];
      this.cForm.category3Id = '';
      // 解构出二级分类的id
      const { category2Id } = this.cForm
      // 将二级分类的id传递给父组件
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 通过一级分类的ID，获取二级分类的数据
      let res = await this.$API.attr.category3List(category2Id)
      if (res.code == 200) {
        this.list3 = res.data
      }
    },
    // 三级分类的事件回调
    handler3() {
      // 解构出三级分类的id
      const { category3Id } = this.cForm
      // 将二级分类的id传递给父组件
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })

    },
  },
}
</script>

<style scoped></style>
