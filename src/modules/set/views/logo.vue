<template>
  <div class="box">
    <Upload v-model="form.url" url="/upload" width="600px" height="160px" auto />
    <el-divider></el-divider>
    <el-button type="primary" @click="handleSave">保存设置</el-button>

  </div>
</template>

<script>
import Upload from '@/modules/upload.vue'
import { ajax } from '@/api/ajax'
export default {
  name: "List",
  components: {
    Upload
  },
  data() {
    return {
      form: {
        type: 1,
        label: 'logo',
        url: ''
      }
    };
  },

  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$global.loading = true;
      ajax({
        url: `/link`,
        data: {
          type: 1,
          total: true,
          pageNum: 1,
          pageSize: 10
        }
      }).then(({ data }) => {
        const { list } = data;
        if (list.length) {
          this.form = {
            ...this.form,
            ...list[0]
          }
        }

      }).finally(() => {
        this.$global.loading = false;
      })
    },
    handleSave() {
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
          this.getData()
        })
        .finally(() => {
          this.$global.loading = false;
        });
    }
  },
};
</script>
