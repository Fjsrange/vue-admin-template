<template>
  <div>
    <el-table style="width: 100%;" border prop="prop" :data="skuList" v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="width" align="center">
      </el-table-column>

      <el-table-column prop="skuDesc" label="描述" width="width" align="center">
      </el-table-column>

      <el-table-column prop="skuDefaultImg" label="默认图片" width="width" align="center">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px;">
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" width="80" align="center">
      </el-table-column>

      <el-table-column prop="price" label="价格(元)" width="80" align="center">
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="success" icon="el-icon-top" size="mini" v-if="row.isSale == 0"
            @click="onSale(row)"></el-button>
          <el-button type="info" icon="el-icon-bottom" size="mini" v-else @click="onCancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(row)"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-popconfirm :title="`确定删除${row.skuName}吗？`" @onConfirm="handlerRemove(row)">
            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"
              style="margin-left: 10px;"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
      :page-sizes="[3, 5, 10]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
      style="margin-top: 20px; text-align: center">
    </el-pagination>

    <el-drawer :title="skuInfo.skuName" :visible.sync="dialog" direction="rtl" ref="drawer" size="40%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right: 10px;">{{
              attr.id }} - {{ attr.valueId
  }}</el-tag>
          </template>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">视频图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
              <img :src="img.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      skuList: [], //存储sku列表数据
      loading: true, //控制是否显示骨架屏
      page: 1, //默认展示第一页数据
      limit: 5, //每次请求的数据个数
      total: 0, //存储分页器一共展示的数据条数
      dialog: true, // 抽屉的显示与隐藏
      formLabelWidth: '80px',
      skuInfo: {},
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList() {
      const { page, limit } = this;
      let res = await this.$API.sku.skuList(page, limit);
      if (res.code == 200) {
        this.skuList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    /* 操作列 */
    // 上架
    async onSale(row) {
      this.loading = true; // 显示loading
      let res = await this.$API.sku.onSale(row.id);
      if (res.code == 200) {
        this.$message({ type: 'success', message: '上架成功' });
        row.isSale = 1;
        this.loading = false; // 显示loading
      }
    },
    // 下架
    async onCancel(row) {
      this.loading = true; // 显示loading
      let res = await this.$API.sku.onCancel(row.id);
      if (res.code == 200) {
        this.$message({ type: 'success', message: '下架成功' });
        row.isSale = 0;
        this.loading = false; // 显示loading
      }
    },
    // 编辑
    handleEdit(row) {
      // this.$emit('edit',row)
      this.$message('正在开发中')
    },
    // 详情
    async getSkuInfo(row) {
      let res = await this.$API.sku.getSkuById(row.id);
      console.log('rews', res);
      if (res.code == 200) {
        this.dialog = true;
        this.skuInfo = res.data;
      }
    },
    // 删除
    handlerRemove(row) {
      console.log('删除', row);

    },
    /* 分页器 */
    // 每页条数变化时触发
    handleSizeChange(val) {
      this.limit = val; // 修改每页展示多少条数据
      this.getPageList(); // 重新获取列表数据
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.loading = true; // 显示loading
      this.page = val; // 修改当前页
      this.getPageList(); // 重新获取列表数据
    },
  },
};
</script>


<style scoped>
/* row下的col */
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px;
}

/* 轮播图 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
