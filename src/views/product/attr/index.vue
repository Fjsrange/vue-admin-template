<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" :disabled="!category3Id" icon="el-icon-plus" @click="addAttr">添加属性</el-button>

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

        <el-button type="primary" :disabled="!attrInfo.attrName.trim()" icon="el-icon-plus"
          @click="addAttrValue">添值加属性</el-button>
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table :data="attrInfo.attrValueList" border style="width: 100%; margin: 20px 0;" align="center">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <el-input v-model="row.valueName" size="mini" placeholder="请输入属性值名称" />
              <span>{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(row, $index)"></el-button>
            </template>
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
// 按需引入 loadsh 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'

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
        categoryId: 0, // 第三级分类id
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
    /**
     * 表单模块
     */
    // 编辑
    handlerEdit(row) {
      console.log('编辑 row', row);
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 深拷贝和浅拷贝在面试的时候出现的频率较高，需达到可手写深拷贝和浅拷贝
      this.attrInfo = cloneDeep(row)
    },
    // 删除
    handlerRemove(row) {
      console.log('删除 row', row);
      this.isShowTable = false;

    },
    // 打开表单
    addAttr() {
      this.isShowTable = false;
      // 清除数据
      // 收集三级分类的id
      this.attrInfo = {
        attrName: '', // 属性名称
        attrValueList: [], // 属性值
        categoryId: this.category3Id, // 第三级分类id
        categoryLevel: 3, // 分类等级
      }
    },
    // 添加属性值
    async addAttrValue() {
      // 向属性值的数组中添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
      })
    },
    // 删除
    remove(row, index) {
      console.log('表单内删除 row', row, 'index', index);
      this.attrInfo.attrValueList.splice(index, 1)
      this.getAttrList();
    },
  }
};
</script>

<style scoped></style>
