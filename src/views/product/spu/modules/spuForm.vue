<template>
  <div class="">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="region" placeholder="请选择品牌">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="description" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="spuImageList" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="region" placeholder="请选择销售属性">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table :data="spuSaleAttrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="date" label="属性名" width="180">
          </el-table-column>
          <el-table-column prop="name" label="属性值名称列表">
            <template slot-scope="{row, $index}">
              <el-button type="primary" size="mini" plain>黑色<i class="el-icon-close  el-icon--right"></i></el-button>
              <el-button size="mini" plain>添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{row, $index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'spuForm',
  components: {},
  data() {
    return {
      spuName: '',
      region: '',
      description: '',
      spuImageList: '',
      dialogVisible: false,
      spuSaleAttrList: [],
    }
  },
  methods: {
    // 初始化spu表单数据
    initSpuData(row) {
      console.log('spurow', row);

    },
    /* 表单区域 */
    // 上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.spuImageList = file.url;
      this.dialogVisible = true;
    },
    // 提交表单
    onSubmit() {
      console.log('submit!');
    },
  },
}
</script>

<style scoped></style>
