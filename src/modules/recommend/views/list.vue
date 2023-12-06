<template>
  <div class="box">
    <el-form :model="form" ref="form" inline>
      <!-- <el-form-item label="题名">
        <el-input v-model="form.title" placeholder="请输入题名" clearable />
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="form.docType" placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="form.keyWords" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="责任者">
        <el-input v-model="form.responsible" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="出版者">
        <el-input v-model="form.publisher" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="出版地">
        <el-input v-model="form.place" placeholder="请输入" clearable />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-button type="primary" @click="handleSearch">刷新</el-button>
        <el-button @click="handleRe">重置</el-button>
      </el-form-item> -->
    </el-form>
    <div class="handle">
      <el-button type="success" @click="handleAdd">添加推荐图书</el-button>
      <el-button type="primary" @click="handleSearch">刷新</el-button>
    </div>
    <el-divider></el-divider>
    <div class="body">
      <transition-group tag="div" class="container">
        <div class="item" v-for="item in list" :key="item.id" draggable="true" @dragstart="handleDragStart($event, item)"
          @dragover.prevent="handleDragOver($event, item)" @dragenter="handleDragEnter($event, item)"
          @dragend="handleDragEnd($event, item)">
          <Card class="item" :data-image="item.imageUrl" :title="item.title" :item="item" @delete="handleCancel">
          </Card>
        </div>
      </transition-group>
    </div>
    <el-divider></el-divider>
    <div class="submit">
      <el-button v-if="isUpload" type="primary" @click="handleSort">更新排序</el-button>
    </div>

    <!--  -->
    <el-dialog title="图书列表" :visible.sync="add" width="960px">
      <BookList :noBtns="['add', 'edit', 'delete', 'see']" :otherBtns="['select']" @getData="getData"
        :layoutOption="layoutOption" :btnOption="btnOption" :conditionBtn="conditionBtn" />
      <span slot=" footer">
        <el-button @click="add = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ajax } from '@/api/ajax';

import Card from './card.vue'

import BookList from '@/modules/book/views/list.vue'
export default {
  name: "List",
  components: {
    Card,
    BookList
  },
  data() {
    return {
      form: {},
      initForm: {},
      // dragging
      list: [],
      initList: [],
      ending: null,
      dragging: null,
      // 
      add: false,
      layoutOption: {
        table: {
          height: '400px'
        }
      },
      btnOption: {
        select: {
          name: '设为推荐'
        }
      },
      conditionBtn: {
        select: ({ row: { id } }) => {
          return !this.list.map(({ id }) => id).includes(id)
        }
      }
    };
  },
  computed: {
    ...mapGetters([]),
    isUpload() {
      let isUpload = false;
      for (let i in this.list) {
        const { id } = this.list[i] || {};
        const { id: eid } = this.initList[i] || {};
        if (id !== eid) {
          isUpload = true
        }
      }
      return isUpload
    }
  },
  created() {
    this.handleSearch()
    this.initForm = { ...this.form };
    this.initList = [...this.list]
  },
  methods: {
    handleSearch() {
      this.$global.loading = true;
      ajax({
        url: "/books/recommend"
      }).then(({ data }) => {
        const { list } = data;
        this.list = list;
      }).finally(() => {
        this.$global.loading = false
      })
    },
    handleRe() {
      this.form = { ...this.initForm }
    },
    handleAdd() {
      this.add = true
    },
    // 设为推荐
    getData(data) {
      const { id } = data[0] || {};
      if (id) {
        this.$global.loading = true;
        ajax({
          url: `/books/setRecommend/${id}`,
          method: 'put'
        }).then(() => {
          this.$notify.success('设置推荐成功');
          this.handleSearch()
        }).finally(() => {
          this.$global.loading = false;
        })
      }
    },
    // 取消推荐
    handleCancel(id) {
      if (id) {
        this.$global.loading = true;
        ajax({
          url: `/books/offRecommend/${id}`,
          method: 'put'
        }).then(() => {
          this.$notify.success('取消推荐成功');
          this.handleSearch()
        }).finally(() => {
          this.$global.loading = false;
        })
      }
    },
    // 保存排序
    handleSort() {
      this.$global.loading = true;
      ajax({
        url: `/books/sortRecommend`,
        method: 'put',
        data: {
          ids: this.list.map(({ id }) => id)
        }
      }).then(() => {
        this.$notify.success('取消推荐成功');
        this.handleSearch()
      }).finally(() => {
        this.$global.loading = false;
      })

    },
    // 拖拽
    handleDragStart(e, item) {
      this.dragging = item
    },
    handleDragEnd(e, item) {
      if (this.ending.id === this.dragging.id) {
        return
      }

      let newItems = [...this.list]
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(this.ending)
      newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]))
      console.log(newItems)

      this.list = newItems
      this.$nextTick(() => {
        this.dragging = null
        this.ending = null
      })
    },
    handleDragOver(e) {
      // 首先把div变成可以放置的元素，即重写dragenter/dragover
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
      this.ending = item
    }
  },
};
</script>

<style lang="scss" scoped>
.box {
  .body {

    .container {
      display: flex;
      flex-wrap: wrap;

      .item {
        transition-duration: 300ms;
      }
    }

  }
}
</style>
