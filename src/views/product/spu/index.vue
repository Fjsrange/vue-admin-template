<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="changeSpu">添加SPU</el-button>

        <el-table :data="list" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="180">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="260" align="center">
            <template slot-scope="{row,$index}">
              <el-tooltip class="item" effect="dark" content="添加sku" placement="top">
                <el-button type="success" icon="el-icon-plus" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改spu" placement="top">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="changeSpu(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看当前spu详情" placement="top">
                <el-button type="info" icon="el-icon-warning" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除spu" placement="top">
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <template>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, -> , sizes, total"
            :total="total" style="margin-top: 20px; text-align: center">
          </el-pagination>
        </template>
      </div>
      <spuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene" />
      <skuForm ref="skuForm" v-show="scene == 2" @changeScene="changeScene" />
    </el-card>
  </div>
</template>

<script>
import CategorySelect from "@/components/CategorySelect";
import spuForm from "./modules/spuForm";
import skuForm from "./modules/skuForm";

export default {
  name: "spu",
  components: { CategorySelect, spuForm, skuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      isShowTable: true,
      loading: false, // 表格的加载中效果
      page: 1, // 当前页
      limit: 10, // 每页展示多少条数据
      total: 0, // 总共多少条数据
      list: [],
      scene: 0, // 0代表添加spu，1代表修改spu，2代表添加sku
    };
  },
  methods: {
    /* 三级分类 */
    getCategoryId({ categoryId, level }) {
      // categoryId：获取一、二、三级分类的id  level：为了区分是几级id
      // 先判断是几级id，再进行赋值
      if (level == 1) {
        this.category1Id = categoryId;
        // 清除2、3级id
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = '';
      } else if (level == 3) {
        this.category3Id = categoryId;
        this.loading = true;
        // 获取spu列表
        this.getSpuList();
      }
    },
    /* 列表 */
    // 获取spu列表
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let res = await this.$API.spu.getSpuList(page, limit, category3Id);
      if (res.code == 200) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    // 添加 | 修改
    changeSpu(row) {
      console.log('row', row);
      if (!row.id) {
        // 添加
        console.log('添加');
        this.scene = 1;
        this.$refs.spuForm.initSpuData()
      } else {
        // 修改
        this.scene = 1;
        // 在父组件中可以通过$refs来访问子组件的属性和方法
        this.$refs.spuForm.initSpuData(row)
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
      this.loading = true; // 显示loading
      this.limit = val; // 修改每页展示多少条数据
      this.getSpuList(); // 重新获取列表数据
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.loading = true; // 显示loading
      this.page = val; // 修改当前页
      this.getSpuList(); // 重新获取列表数据
    },
    /* 自定义事件 spuform */
    changeScene(scene) {
      this.scene = scene;
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style scoped></style>
