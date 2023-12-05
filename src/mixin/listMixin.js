import {
  isEmpty
} from 'lodash'
import {
  ajax
} from '@/api/ajax'
import {
  mapActions
} from 'vuex'
import {
  Message
} from 'element-ui'

const ListMixin = {
  data: () => ({
    initSearch: {},
    table: [],
    pages: {
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
    },
  }),
  created() {
    this.initSearch = {
      ...this.search
    }
  },
  methods: {
    ...mapActions({
      setLoading: 'common/setLoading'
    }),
    /**
     * 获取表格数据
     */
    query() {
      if (!this.mixinConfig.url) {
        return
      }
      this.setLoading()
      /**
       * 请求数据处理
       */
      const {
        currentPage,
        pageSize
      } = this.pages;
      let data = {
        ...this.search,
        pageNum: currentPage,
        pageSize,
        total: true,
      };
      if (this.searchFilter) {
        data = this.searchFilter(data)
      }
      /**
       * 表单请求
       */
      return new Promise((resolve, reject) => {
        ajax({
          url: this.mixinConfig.url,
          type: 'get',
          data
        })
          .then(({
            data
          }) => {
            if (!isEmpty(data)) {
              try {
                this.pages.pageTotal = data.total
                this.table = data.list
              } catch (error) { }
              // 进行数据处理
              try {
                this.filterQuery(data)
              } catch (error) { }
              resolve(data)
            }
          })
          .finally(() => {
            this.setLoading(false)
          })
      })
    },
    /**
     * 查询
     */
    handleSearch() {
      this.pages.currentPage = 1;
      this.query();
    },
    /**
     * 重置查询
     */
    handleReset() {
      this.search = {
        ...this.initSearch
      };
    },
    /**
     * 添加 编辑 查看 删除
     */
    handleAdd() {
      this.$router.push("add");
    },
    /**
     * 编辑
     * @param {number | string} id 
     */
    handleEdit(id) {
      this.$router.push("edit?id=" + id);
    },
    /**
     * 查看详情
     * @param {number | string} id 
     */
    handleSee(id) {
      this.$router.push("see?id=" + id);
    },
    /**
     * 删除
     * @param {number | string} id 
     */
    handleDelete(id) {
      this.setLoading(true);
      ajax({
        url: `${this.mixinConfig.deleteUrl || this.mixinConfig.url}/${id}`,
        type: "delete",
      })
        .then((res) => {
          Message.success('成功')
          this.query();
        })
        .catch(() => {
          this.setLoading(false);
        });
    },
    /**
     * 表格默认分页更改事件
     */
    handleCurrentChange(i) {
      this.pages.currentPage = i
      this.query()
    },
    handleSizeChange(i) {
      this.pages.pageSize = i
      this.pages.currentPage = 1
      this.query()
    },
  },
}
export default ListMixin
