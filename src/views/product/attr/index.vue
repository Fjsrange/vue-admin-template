<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" :disabled="!category3Id" icon="el-icon-plus" @click="addAttr">添加属性</el-button>

        <el-table style="width: 100%;" border prop="prop" :data="list" v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
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
            <template slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="handlerEdit(row)"></el-button>

              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="handlerRemove($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"
                  style="margin-left: 10px;"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <template>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[3, 5, 10]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
            style="margin-top: 20px; text-align: center">
          </el-pagination>
        </template>
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
              <!-- 这里结构需要用到span与input之间来回切换 -->
              <el-input v-if="row.flag" v-model="row.valueName" @blur="toLock(row)" @keyup.native.enter="flag = false"
                size="mini" placeholder="请输入属性值名称" :ref="$index" />
              <span v-else @click="toEdit(row, $index)" style="display: block;">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="remove($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addUpdataAttr">保存</el-button>
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
      isShowTable: true, // 控制table显示与隐藏
      attrInfo: {
        attrName: '', // 属性名称
        attrValueList: [], // 属性值
        categoryId: 0, // 第三级分类id
        categoryLevel: 3, // 分类等级
      },
      loading: false, // 表格的加载中效果
      page: 1, // 当前页
      limit: 10, // 每页展示多少条数据
      total: 0, // 总共多少条数据
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
        this.loading = true;
        // 发请求获取平台属性
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      let res = await this.$API.attr.attrInfoList(category1Id, category2Id, category3Id)
      if (res.code == 200) {
        this.list = res.data;
        this.total = res.data.length;
        this.loading = false;
        this.updateList();
      }
    },
    /* 分页器 */
    // 新增一个方法用于根据当前的 page 和 limit 更新当前页的数据
    updateList() {
      // 计算出当前页数据在数组中的起始索引。这里要考虑到页数从 1 开始，而数组的索引是从 0 开始，所以需要减去 1。
      const startIndex = (this.page - 1) * this.limit;
      // 计算出当前页数据在数组中的结束索引（不包含结束索引本身）。
      // 例如，如果当前页 page 是 1，每页显示条数 limit 是 3，那么 endIndex 就是 1 * 3 = 3，表示当前页的数据在数组中的结束位置是索引 3。
      const endIndex = this.page * this.limit;
      // 最后，通过 this.list.slice(startIndex, endIndex) 获取 list 数组中从 startIndex 到 endIndex 之间的数据，并将这部分数据赋值给 this.list，从而更新当前页需要展示的数据。
      this.list = this.list.slice(startIndex, endIndex);
    },
    // 调整 handleSizeChange 和 handleCurrentChange 方法，直接调用 updateList 方法更新当前页的数据
    // 每页条数变化时触发
    handleSizeChange(val) {
      this.limit = val; // 修改每页展示多少条数据
      this.getAttrList(); // 重新获取列表数据
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.loading = true; // 显示loading
      this.page = val; // 修改当前页
      this.getAttrList(); // 重新获取列表数据
    },
    /**
     * 表单模块
     */
    // 编辑
    handlerEdit(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 深拷贝和浅拷贝在面试的时候出现的频率较高，需达到可手写深拷贝和浅拷贝
      this.attrInfo = cloneDeep(row);
      // 在修改某偶一个属性的时候，将相应的属性值元素添加flag责怪标记
      this.attrInfo.attrValueList.forEach(item => {
        // item.flag = false;
        // 这样属性也可以给属性值添加flag字段，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        // 因为Vue无法探测普通的新增 property ，这样书写的属性绑匪响应式属性（数据变化试图会跟着变化）
        // 第一个参数：对象， 第二个参数：添加新的响应式属性，第三个参数：新的属性的属性值
        // this.$set(给哪个对象添加，添加的属性名称，属性的值)
        this.$set(item, 'flag', false); // 添加响应式属性
      });
    },
    // 删除
    async handlerRemove(index) {
      this.loading = true;
      let res = await this.$API.attr.deleteAttr(this.list[index].id);
      if (res.code == 200) {
        this.list.splice(index, 1)
        this.getAttrList();
      }
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
        flag: true,
      })
      // flag属性：给每一个属性值添加一个flag属性，用于标识当前的属性值是否被编辑
      // 当前的flag属性是响应式属性（数据变化视图跟着变化）
      this.$nextTick(() => {
        // 获取input相应的表单元素，实现自动聚焦
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    // 气泡框确认回调 删除
    remove(index) {
      this.attrInfo.attrValueList.splice(index, 1)
      this.getAttrList();
    },
    // 属性值名称
    toLock(row) {
      if (row.valueName.trim() == '') {
        this.$message('请输入属性值');
        return;
      }
      // 新增的属性值不能重复
      // 判断是否已经添加过属性值
      let isRepat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        // row是最新新增的属性值（数组中新增的对象）
        // 判断的时候需要 把已有的数组当中新增的这个属性值去掉
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepat) {
        this.$message('该属性值名称已存在')
        return;
      }
      row.flag = false;
    },
    // 点击span变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 需要注意：点击input的时候，切换为input为编辑模式，但是需要注意对于浏览器而言，
      // 页面的重绘与重拍是有一定耗时的，所以如果直接在页面上点击input，
      // 页面可能出现卡顿的情况，所以这里需要使用$nextTick
      // $nextTick的作用，就是当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        // 获取input相应的表单元素，实现自动聚焦
        this.$refs[index].focus();
      })
    },
    // 保存表单
    async addUpdataAttr() {
      // 如果用户添加了很多属性值，且属性值为空的，则不提交给服务器
      // filter方会返回一个新的数组，它是用于过滤的，从起始数组中遍历每个元素筛选出你想要的元素
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          // 删除flag属性
          // delete item.flag;
          return true;
        }
      })
      try {
        this.loading = true;
        await this.$API.attr.saveAttrInfo(this.attrInfo)
        this.$message({ type: 'success', message: '保存成功' });
        this.isShowTable = true;
        this.getAttrList()
      } catch (err) {
        this.$message.error(err.message)
      }
    },
  }
};
</script>

<style scoped></style>
