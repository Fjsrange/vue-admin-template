<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" :disabled="!category3Id" icon="el-icon-plus"
          @click="isShowTable = false">添加属性</el-button>

        <el-table style="width: 100%;" border prop="prop" :data="list">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin: 0 5px;">{{
                item.valueName }}</el-tag>
            </template>

          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="handlerEdit(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handlerRemove(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" :model="attrInfo">
          <el-form-item label="属性名称">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" :disabled="!attrInfo.attrName" icon="el-icon-plus"
          @click="isShowTable = false">添值加属性</el-button>
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table :data="attrValueList" border style="width: 100%" align="center">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <el-input v-model="valueName" size="mini" placeholder="输入关键字搜索" />
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
          </el-table-column>
        </el-table>

        <el-button type="primary" :disabled="!attrInfo.attrName" icon="el-icon-plus"
          @click="isShowTable = false">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "attr",
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      list: [],
      isShowTable: false, // 控制table显示与隐藏
      attrInfo: {
        attrName: '', // 属性名称
        attrValueList: [], // 属性值
        valueName: '',
        categoryId: 0, // 三级分类id
        categoryLevel: 3, // 分类等级
      }
    };
  },
  methods: {
    // 自定义事件回调
    async getCategoryId({ categoryId, level }) {
      // 区分三级分类id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = '';
      } else {
        this.category3Id = categoryId;
        // 发请求获取平台属性
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      let res = await this.$API.attr.attrInfoList(category1Id, category2Id, category3Id)
      console.log('res', res);
      if (res.code == 200) {
        this.list = res.data;
      }
    },
    // 删除
    handlerRemove(row) {
      console.log('row', row);

    },
  }
};
</script>

<style scoped></style>
