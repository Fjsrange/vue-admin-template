<template>
  <div class="">
    <el-form
      ref="form"
      :model="spu"
      label-width="80px"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
        >
          <el-option
            :label="base.name"
            :value="`${base.id}:${base.name}`"
            v-for="base in unSelectSaleAttr"
            :key="base.id"
          ></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table :data="spu.spuSaleAttrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="180">
          </el-table-column>

          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue($event, $index, row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",
  components: {},
  data() {
    return {
      loading: false, // 表单的加载中效果
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0, // 三级分类id
        spuName: "", // spu名称
        tmId: "",
        description: "",
        spuImageList: [],
        spuSaleAttrList: [],
      }, // 存储spu信息属性
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储spu图片信息
      spuSaleAttrValueList: [], // 存储销售属性
      attrIdAndAttrName: "", // 收集未选择的销售属性id和属性名
    };
  },
  computed: {
    // 销售属性还有没有未选择的
    unSelectSaleAttr() {
      // return this.spuSaleAttrValueList.length - this.spu.spuSaleAttrList.length || 0;
      // 从已有的数据中过滤出还未选择的销售属性
      // 数组过滤的方法,可以从已有的数组当中过滤出用户需要的元素,并返回一个新的数据
      let res = this.spuSaleAttrValueList.filter((item) => {
        if (this.spu.spuSaleAttrList) {
          // every 是数组的方法,会返回一个布尔值
          return this.spu.spuSaleAttrList.every((item1) => {
            return item.name !== item1.saleAttrName;
          });
        }
      });
      return res;
    },
  },
  methods: {
    // 父组件添加spu按钮事件
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMark = await this.$API.spu.getTradeMarkList();
      if (tradeMark.code == 200) {
        this.tradeMarkList = tradeMark.data;
      }
      // 获取平台全部销售属性
      let spuSaleAttrValueList = await this.$API.spu.getBaseSaleAttrList();
      if (spuSaleAttrValueList.code == 200) {
        this.spuSaleAttrValueList = spuSaleAttrValueList.data;
      }
    },
    // 父组件修改spu按钮事件 初始化spu表单数据
    async initSpuData(row) {
      // 修改spu的时候,需要收集数据
      this.loading = true;
      // 获取spu信息
      let res = await this.$API.spu.getSpuById(row.id);
      if (res.code == 200) {
        this.spu = res.data;
      }
      // 获取spu图片的数据
      let spuImageList = await this.$API.spu.getSpuImageList(row.id);
      if (spuImageList.code == 200) {
        let imgArr = spuImageList.data;
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        // 需要把服务器返回的数据进行修改
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据进行赋值
        this.spuImageList = imgArr;
      }
      // 获取品牌信息
      let tradeMark = await this.$API.spu.getTradeMarkList();
      if (tradeMark.code == 200) {
        this.tradeMarkList = tradeMark.data;
      }
      // 获取平台全部销售属性
      let spuSaleAttrValueList = await this.$API.spu.getBaseSaleAttrList();
      if (spuSaleAttrValueList.code == 200) {
        this.spuSaleAttrValueList = spuSaleAttrValueList.data;
      }
      this.loading = false;
    },
    /* 表单区域 */
    // 删除图片
    handleRemove(file, fileList) {
      // file参数:代表的是删除的那个图片
      // fileList参数:代表的是剩余的图片
      console.log(file, fileList);
      // 收集照片墙图片的数据
      // 对于已有的图片【照片墙中现实的图片：有name、url字段的】，因为照片墙显示数据必须要有这两个属性
      // 对于服务器而言不需要name、url字段，将来对于已有的图片数据再提交给服务器的时候，需要进行处理。
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙上传成功回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    /* 销售属性 */
    // 添加销售属性
    addSaleAttr() {
      // 已经收集到的数据
      // 把收集到的销售属性进行分割
      // const
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu对象中添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    // 添加属性值
    addSaleAttrValue(e, index, row) {
      // 通过使用 $set 再ro上添加响应式数据 inputVisible、inputValue
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      row.inputVisible = false;
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message.warning("属性值不能为空");
        return;
      }
      // 属性值不能重复  也可以使用some
      let res = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!res) {
        this.$message.warning("当前属性值名称已存在");
        return;
      }
      // 新增销售属性值
      let newAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newAttrValue);
    },
    // 提交表单
    async onSubmit() {
      // 整理参数
      // 需要整理照片墙的数据，携带参数：需要携带imageName、imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.url =
            (item.response && item.response.data) || item.url),
        };
      });
      let res = await this.$API.spu.addAndUpdateSpu(this.spu);
      if (res.code == 200) {
        this.$message.success("保存成功");
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 取消
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      // 清除数据
      // Object.assign() es6中新增的方法，可以合并对象
      // 组件实例this._data，可以操作data上的数据
      // this._data 可以获取data上的所有数据
      // this.$options 可以获取配置对象，配置对象中有一个data函数执行，返回的响应式数据为空
      //
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
