<template>
  <div class="info">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px">
      <el-form-item label="文档封面" prop="coverUrl">
        <Upload v-model="form.coverUrl" url="/localUpload" width="300px" height="150px" />
      </el-form-item>
      <FormProT :form="form" :list="list" :form-list="formList" />
      <el-form-item label="图书列表">
        <el-button type="primary" @click="show = true" style="margin-bottom: 10px;">添加图书</el-button>
        <el-table :data="table" border stripe>
          <el-table-column prop="title" label="图书名称" min-width="100">
            <template slot-scope="{row}">
              <router-link :to="`/file?id=${row.id}`">{{ row.title }}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="docType" label="图书类型" :formatter="(row) => {
            return this.bookTypeJson[row.docType]
          }" />
          <el-table-column label="操作" width="120">
            <template slot-scope="{row,$index}">
              <el-popconfirm title="取消删除？" placement="top" @confirm="handleCancel(row, $index)">
                <el-button slot="reference" type="text" style="color: red">
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" style="padding: 12px 0;">
          <el-pagination background :current-page="pages.currentPage" :page-size="pages.pageSize"
            :total="pages.pageTotal" :page-sizes="[5, 10, 20, 30, 50]" layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <btn-return />
      </el-form-item>
    </el-form>
    <!--  -->
    <el-dialog title="图书列表" :visible.sync="show" width="1230px">
      <div style="padding: 12px 0;">
        <BookList :noBtns="['add', 'edit', 'delete', 'see']" :otherBtns="['select']" @getData="getData"
          :layoutOption="layoutOption" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import infoMixin from "@/mixin/infoMixin";
import {
  rulesT,
  blur,
  change,
} from "tqr";
import Upload from '@/modules/upload.vue'
import { ajax } from "@/api/ajax";
import { mapGetters } from 'vuex';

import BookList from '@/modules/book/views/list.vue'

export default {
  name: "Info",
  mixins: [infoMixin],
  props: {
    read: rulesT.Boolean,
  },
  components: {
    Upload,
    BookList
  },
  data() {
    return {
      id: null,
      mixinConfig: {
        url: "/topicLibrary",
      },
      list: {
        roleList: []
      },
      form: {
        id: null,
        coverUrl: "",
        name: "",
        briefIntroduce: "",
        creator: "",
        fullName: "",
        bookIds: [],

      },
      books: [],
      booksId: {},
      formList: [],
      rules: {
        // nickName: blurName,
        coverUrl: change,
        name: blur,
      },
      table: [],
      layoutOption: {
        pages: {
          "page-sizes": [5, 10, 20, 50, 100, 200],
        }
      },
      pages: {
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      },
      show: false
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'bookType', 'bookTypeJson'])
  },
  created() {
    const { id } = this.$route.query;
    this.id = id
    if (id) {
      this.getDetail(id).then(({ topicLibrary, tpyeCount }) => {
        this.init()
        ajax({
          url: '/topicLibrary/books',
          data: {
            id,
          }
        }).then(({ data }) => {
          const { list } = data;
          this.books = list.map(el => {
            this.booksId[el.id] = true;
            return { ...el, isAjax: true }
          })
          this.query()
        })
        this.form = topicLibrary;
      })
    } else {
      const { nickName } = this.userInfo;
      this.form.creator = nickName;
      this.init()
    }
    console.log(this.form)
  },
  methods: {
    init() {
      const isRead = this.read;
      this.formList = [
        {
          label: "专题库名称",
          type: "input",
          option: {
            prop: "name",
            isRead,
            initValue: "",
          },
        },
        {
          label: "简介",
          type: "input",
          option: {
            type: 'textarea',
            prop: "briefIntroduce",
            isRead,
            initValue: "",
          },
        },
        {
          label: "创建者",
          type: "input",
          option: {
            prop: "creator",
            isRead,
            initValue: "",
          },
        },
      ];
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { id } = this.form;
          if (id) {
            const as = this.books.filter(({ isAjax }) => !isAjax).map(({ id }) => {
              this.addBook(id)
            })
            Promise.all(as).then(() => {
              const data = { ...this.form, bookIds: this.books.map(({ id }) => id) }
              this.submit(data);
            })
          } else {
            const data = { ...this.form, bookIds: this.books.map(({ id }) => id) }
            this.submit(data);
          }

        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });
    },
    addBook(id) {
      return new Promise((r) => {
        ajax({
          url: '/topicLibrary/books',
          method: 'post',
          data: {
            bookId: id,
            topicId: this.form.id
          }
        }).then(() => {
          r(1)
        })
      })
    },
    getData(data) {
      const item = data[0]
      const { id } = item;
      if (this.booksId[id]) {
        this.$notify.warning('改图书已存在')
      } else {
        this.books.push(...data)
        this.booksId[id] = true;
        this.pageTotal = this.books.length;
        this.query();
        this.$notify.success('添加成功')
      }
    },

    handleCancel(i) {
      const { id, isAjax } = i;
      if (isAjax) {
        this.$global.loading = true;
        ajax({
          url: '/topicLibrary/books',
          method: 'delete',
          data: {
            bookId: id,
            topicId: this.form.id
          }
        }).then(() => {
          const ids = this.books.map(({ id }) => id)
          const index = ids.indexOf(id)
          this.books.splice(index, 1)
          this.booksId[id] = null;
          this.pageTotal = this.books.length;
          this.query()
          this.$notify.success('删除成功')
        }).finally(() => {
          this.$global.loading = false
        })
      } else {
        const ids = this.books.map(({ id }) => id)
        const index = ids.indexOf(id)
        this.books.splice(index, 1)
        this.booksId[id] = null;
        this.pageTotal = this.books.length;
        this.query()
        this.$notify.success('删除成功')
      }
    },
    query() {
      const param = {
        initTable: this.books,
      };
      // 分页
      const { currentPage, pageSize } = this.pages;
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      // 获取匹配的数据
      const { initTable } = param;
      // 获取当前的数据
      this.table = initTable.slice(start, end);
      this.pages.pageTotal = initTable.length;
    },
    handleSearch() {
      this.pages.currentPage = 1;
      this.query();
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
