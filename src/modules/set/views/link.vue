<template>
  <div class="box">
    <div>
      <el-button type="primary" @click="handleSearch">刷新</el-button>
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <div class="table">
      <el-table :data="list" border stripe>
        <el-table-column prop="label" label="链接名称" />
        <el-table-column prop="url" label="链接地址" />
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm class="ml10" title="确定删除？" placement="top" @confirm="handleDelete(row.id)">
              <el-button slot="reference" type="text" style="color: red">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <el-pagination background :current-page="pages.currentPage" :page-size="pages.pageSize" :total="pages.pageTotal"
        :page-sizes="[5, 10, 20, 30, 50]" layout="sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <!--  -->
    <el-dialog title="相关链接" :visible.sync="show" width="600px">
      <el-form :model="form" ref="form" :rules="rules" style="padding-top: 12px;">
        <el-form-item label="链接名称" prop="label">
          <el-input v-model="form.label" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="http://******" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { blur } from "tqr";
import { ajax } from '@/api/ajax'
export default {
  name: "List",
  data() {
    return {
      mixinConfig: {
        url: "/books",
      },
      list: [],
      pages: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      },
      // 
      show: false,
      form: {
        type: 3,
        label: '',
        url: ''
      },
      initForm: {},
      rules: {
        label: blur,
        url: blur
      }
    };
  },

  created() {
    this.initForm = { ...this.form }
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.$global.loading = true;
      const { currentPage, pageSize } = this.pages
      ajax({
        url: `/link`,
        data: {
          type: 3,
          total: true,
          pageNum: currentPage,
          pageSize
        }
      }).then(({ data }) => {
        const { list, total } = data;
        this.list = list;
        this.pages.pageTotal = total;

      }).finally(() => {
        this.$global.loading = false;
      })
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$global.loading = true;
          const data = { ...this.form };
          const { id } = data
          ajax({
            url: '/link',
            method: id ? "put" : 'post',
            data
          })
            .then((res) => {
              this.$notify.success('成功')
              this.handleSearch()
              this.show = false;
            })
            .finally(() => {
              this.$global.loading = false;
            });
        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });
    },
    handleAdd() {
      this.form = { ...this.initForm }
      this.show = true
    },
    handleEdit(data) {
      this.form = { ...data }
      this.show = true
    },
    handleDelete(id) {
      this.$global.loading = true;
      ajax({
        url: `/link/${id}`,
        method: 'delete'
      }).then(() => {
        this.$notify.success('删除成功')
        this.handleSearch()

      }).finally(() => {
        this.$global.loading = false;
      })
    },
    handleCurrentChange(i) {
      this.pages.currentPage = i
      this.handleSearch()
    },
    handleSizeChange(i) {
      this.pages.pageSize = i
      this.pages.currentPage = 1
      this.handleSearch()
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  .table {
    padding: 12px 0;
  }
}
</style>
