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
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>

        <el-table-column
          prop="brandName"
          label="品牌名称"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="brandLogo"
          label="品牌LOGO"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="date" label="操作" width="width" align="center">
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
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
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
      pageNum: 1, // 当前页
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style scoped></style>
