<template>
  <div class="">
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="请输入SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="请输入价格(元)"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="请输入重量(千克)"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuInfo.skuDesc" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select :placeholder="`请选择${attr.attrName}`" v-model="attr.attrIdAndeItemId">
              <el-option :label="item.valueName" :value="`${attr.id}:${item.id}`" v-for="item in attr.attrValueList"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="sale.saleAttrName" v-for="sale in saleAttrList" :key="sale.id">
            <el-select :placeholder="`请选择${sale.saleAttrName}`" v-model="sale.saleIdAndeItemId">
              <el-option :label="item.saleAttrValueName" :value="`${sale.id}:${item.id}`"
                v-for="item in sale.spuSaleAttrValueList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="spuImgList" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"></el-table-column>

          <el-table-column prop="imgUrl" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>

          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row, $index)">设置默认</el-button>
              <el-button type="success" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <template slot-scope="{ row }">
          <el-button type="primary" @click="save(row)">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  components: {},
  data() {
    return {
      spuImgList: [], // 图片列表
      saleAttrList: [], // 销售属性
      attrInfoList: [], // 平台属性
      skuInfo: { // 收集sku数据
        category3Id: 0,
        tmId: '', // 品牌
        spuId: '', // 需要收集
        skuName: '', // sku名称
        price: '', // 价格
        weight: '', // 重量
        skuDesc: '', // 规格描述
        skuDefaultImg: '', // 默认图片
        skuImageList: [], // 收集图片的字段
        skuAttrValueList: [], // 平台属性
        skuSaleAttrValueList: [], // 销售属性
      },
      spu: {},
      imageList: [], // 收集图片的字段
    };
  },
  methods: {
    /* 获取skuForm数据 */
    async getData(category1Id, category2Id, row) {
      // 收集父组件传递的参数
      // id: spuId 是解构重命名语法
      const { category3Id, id: spuId, tmId } = row;
      this.skuInfo = { ...this.skuInfo, category3Id, spuId, tmId };
      this.spu = row;
      // 获取图片数据
      let resImg = await this.$API.spu.spuImgList(row.id);
      if (resImg.code == 200) {
        let list = resImg.data;
        list.forEach(item => {
          item.isDefault = 0;
        })
        console.log('list', list);

        this.spuImgList = list;
      }

      // 获取销售属性数据
      let resAttr = await this.$API.spu.saleAttrList(row.id);
      console.log('resAttr', resAttr);
      if (resAttr.code == 200) {
        this.saleAttrList = resAttr.data;
      }

      // 获取平台属性数据
      let resInfo = await this.$API.spu.attrInfoList(category1Id, category2Id, row.category3Id)
      console.log('resInfo', resInfo);
      if (resInfo.code == 200) {
        this.attrInfoList = resInfo.data
      }

    },
    /* 图片列表 */
    // 勾选
    handleSelectionChange(val) {
      console.log('勾选 val', val);
      this.imageList = val;
    },
    // 设为默认
    changeDefault(row, index) {
      this.spuImgList.forEach(item => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    /* 按钮操作 */
    // 保存
    async save() {
      const { attrInfoList, skuInfo, saleAttrList, imageList } = this;
      // 整理平台属性的数据方式一
      /* // 新建数组
      let arr = [];
      attrInfoList.forEach(item => {
        // 当前平台属性用户选择的选项
        if (item.attrIdAndeItemId) {
          const [attrId, valueId] = item.attrIdAndeItemId.split(':');
          let obj = {
            attrId,
            valueId
          }
          arr.push(obj);
        }
      })
      // 将数据整理好后赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = arr; */
      // 整理平台属性的数据方式二
      // reduce是用来累加的，prev代表前面的累加值，item是这次的值
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndeItemId) {
          const [attrId, valueId] = item.attrIdAndeItemId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev;
      }, [])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev, item) => {
        if (item.saleIdAndeItemId) {
          const [saleAttrId, saleAttrValueId] = item.saleIdAndeItemId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, [])
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl || item.response.data,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      });
      console.log('this.skuInfo', this.skuInfo);
      try {
        let res = await this.$API.spu.saveSkuInfo(this.skuInfo);
        console.log('res', res);
        if (res.code == 200) {
          this.$message.success('保存成功');
          this.$emit('skuScene', 0);
          Object.assign(this._data, this.$options.data());
        }
      } catch (error) {
        console.log(error);
        console.dir(error)
      }

    },
    // 取消
    cancel() {
      this.$emit("skuScene", 0);
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style scoped></style>
