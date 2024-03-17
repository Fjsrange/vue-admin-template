<template>
  <div>
    <!-- 添加 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <!-- 表格信息
      data: 表格组件将来需要展示的数据
      border: 表格添加边框
      stripe: 表格添加斑马条纹
      column的相应属性
      prop: 表示当前列显示的数据字段名
      label: 表示当前列的标题
    -->
    <template>
      <el-table
        :data="list"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        border
        style="width: 100%; margin-top: 20px"
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>

        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="logoUrl"
          label="品牌LOGO"
          width="width"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <img :src="row.logoUrl" alt="" style="width: 100px; height: 65px" />
          </template>
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="width" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(row)"
              >编辑</el-button
            >

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <!--    
        :current-page="1" 表示当前页是第几页
        :page-sizes="[3, 5, 7]" 表示每页展示多少条数据
        :page-size="5" 表示当前页展示多少条数据
        :total="400" 表示总共多少条数据
        layout: 分页器的布局
        layout中添加 '->' 可以让后面的数据在右边展示
        layout="total, sizes, prev, pager,->, next, jumper"
        :hide-on-single-page="true" 表示如果只有一页数据，则不显示分页器
        :pager-count="11" 表示分页器页码最大按钮个数
      -->
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 20px; text-align: center"
        >
        </el-pagination>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, // 当前页
      limit: 3, // 每页展示多少条数据
      total: 0, // 总共多少条数据
      // pageSize: 5, // 每页展示多少条数据
      list: [], // 存储列表数据
      loading: true, // 加载中
    };
  },
  // 组件挂载完毕发请求
  mounted() {
    this.getPageList(); // 调用获取列表数据的方法
  },
  methods: {
    // 获取品牌列表数据
    async getPageList() {
      const { page, limit } = this;
      let res = await this.$API.tradeMark.getTradeMarkList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
        this.loading = false; // 数据请求完毕，关闭loading
      }
    },
    // 每页条数变化时触发
    handleSizeChange(val) {
      this.limit = val; // 修改每页展示多少条数据
      this.getPageList(); // 重新获取列表数据
      console.log(`每页 ${val} 条`);
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.page = val; // 修改当前页
      this.getPageList(); // 重新获取列表数据
      console.log(`当前页: ${val}`);
    },
    // 编辑
    handleEdit(row) {
      console.log("编辑", row);
    },
    // 删除
    handleDelete(row) {
      console.log("删除", row);
    },
  },
};
</script>

<style scoped></style>
