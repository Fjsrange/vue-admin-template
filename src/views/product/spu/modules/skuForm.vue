<template>
  <div class="">
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> 海绵宝宝 </el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="sku.skuName" placeholder="请输入SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="sku.spuName" placeholder="请输入价格(元)"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          v-model="sku.spuName"
          placeholder="请输入重量(千克)"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="sku.description"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="屏幕尺寸">
            <el-select placeholder="请选择屏幕尺寸" value="">
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="屏幕尺寸">
            <el-select placeholder="请选择屏幕尺寸" value="">
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%" border="">
          <el-table-column type="selection" width="80"></el-table-column>

          <el-table-column
            prop="prop"
            label="图片"
            width="width"
          ></el-table-column>

          <el-table-column
            prop="prop"
            label="名称"
            width="width"
          ></el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          ></el-table-column>
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
      sku: {
        skuName: "",
        spuName: "",
        description: "",
      },
    };
  },
  methods: {
    getData(row) {
      console.log("row", row);
    },
    /* 按钮操作 */
    save() {},
    cancel() {
      this.$emit("changeScenes", { scene: 0, flag: "" });
    },
  },
};
</script>

<style scoped></style>
