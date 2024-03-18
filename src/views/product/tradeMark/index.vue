<template>
  <div>
    <!-- 添加 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >

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
              @click="showDialog(row)"
              >编辑</el-button
            >

            <template>
              <el-popconfirm
                :title="`确定删除${row.tmName}吗？`"
                confirmButtonText="好的"
                cancelButtonText="不用了"
                @onConfirm="handleDelete(row)"
              >
                <!-- <el-button slot="reference" >删除</el-button> -->
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
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

    <!-- 对话框 
      :visible.sync：控制对话框显示与隐藏
    -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" style="width: 80%">
        <el-form-item
          label="品牌名称"
          prop="tmName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          prop="logoUrl"
          :label-width="formLabelWidth"
        >
          <!-- 
            action: 图片上传的地址
            on-success: 图片上传成功后的回调,
            before-upload: 图片上传前的回调
            :show-file-list="false": 是否显示上传的文件列表
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <img
              v-if="form.logoUrl"
              :src="form.logoUrl"
              class="avatar custom-upload"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon custom-upload-ago"
            ></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false, // 控制对话框的显示与隐藏
      form: {
        tmName: "", // 收集品牌名称
        logoUrl: "", // 收集品牌logo
      }, // 收集品牌信息数据
      formLabelWidth: "120px", // 表单域的宽度
      title: "", // 对话框的标题
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "品牌名称长度是2-10个文字",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择图片", trigger: "change" }],
      },
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
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.loading = true; // 显示loading
      this.page = val; // 修改当前页
      this.getPageList(); // 重新获取列表数据
    },
    // 打开对话框
    showDialog(row) {
      this.title = row.id ? "修改品牌" : "添加品牌";
      if (this.title == "添加品牌") {
        this.form = { tmName: "", logoUrl: "" }; // 清除数据
      } else {
        this.form = { ...row }; // 浅拷贝, 修改数据不会影响原数据
      }
      this.dialogFormVisible = true; // 显示对话框
    },
    // // 编辑
    // handleEdit(row) {
    //   console.log("编辑", row);
    //   this.dialogFormVisible = true; // 显示对话框
    // },
    // 删除
    async handleDelete(row) {
      console.log("删除", row);
      let res = await this.$API.tradeMark.removeProduct(row.id);
      this.loading = true; // 显示loading
      console.log("删除res", res);
      if (res.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getPageList();
      }
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
    },
    // 上传文件
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是jpg、png格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.form.logoUrl = file.url;
      this.dialogFormVisible = true;
    },
    // 提交表单
    async handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true; // 显示loading
          let res = await this.$API.tradeMark.addOrUpdateTradeMark(this.form);
          if (res.code == 200) {
            this.$message({
              message: this.form.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.getPageList();
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.custom-upload-ago {
  border: 1px dashed #ccc; /* 自定义边框样式 */
  border-radius: 5px; /* 自定义边框圆角 */
}
.custom-upload {
  border: 1px solid #ccc; /* 自定义边框样式 */
  border-radius: 5px; /* 自定义边框圆角 */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 15px;
  margin: 0 10px;
}
</style>
