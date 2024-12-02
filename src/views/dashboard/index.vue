<template>
  <div class="dashboard-container">
    <el-card shadow="always" :body-style="{ padding: '12px' }" style="margin-bottom:24px ;">
      <h5 style="font-size: 20px;margin:0">欢迎用户：{{ userInfo.usernick || userInfo.username }}，登录系统</h5>
      <el-divider></el-divider>
      <div v-if="userInfo.username === 'admin'" class="benfen">
        <!-- 定时备份 -->
        <div>
          <el-form :model="form" ref="form" :rules="rules" inline>
            <el-form-item label="是否定时备份" prop="type">
              <el-switch v-model="form.type" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item v-if="form.type" label="备份间隔时间(天)">
              <el-input-number v-model="form.backupDay" :min="1" :max="300"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSetBackup">保存设置</el-button>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
        </div>
        <el-button type="primary" plain icon="el-icon-refresh-left" @click="getData">
          刷新
        </el-button>
        <el-popconfirm title="当前操作会覆盖之前备份数据，是否执行？" placement="top" @confirm="handleBF" style="margin-left: 10px;">
          <el-button type="success" plain icon="el-icon-document-copy" slot="reference">
            数据备份
          </el-button>
        </el-popconfirm>



        <!-- <el-popconfirm title="当前操作，会将最近一次的备份数据替换当前数据，是否执行" placement="top" @confirm="handleHF"
          style="margin-left: 10px;">
          <el-button type="success" slot="reference">
            数据恢复
          </el-button>
        </el-popconfirm> -->
        <el-table :data="list" border stripe style="margin-top: 18px;">
          <el-table-column type="index" width="100" label="序号"></el-table-column>
          <el-table-column prop="name" label="备份时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{row}">
              <el-popconfirm title="当前操作，会将最近一次的备份数据替换当前数据，是否执行" placement="top" @confirm="handleHF(row)">
                <el-button type="text" slot="reference">
                  数据恢复
                </el-button>
              </el-popconfirm>
              <el-popconfirm title="当前操作，将会删除备份数据，是否执行" placement="top" @confirm="handleDelete(row)"
                style="margin-left: 10px;">
                <el-button type="text" slot="reference" style="color:red">
                  删除备份
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" style="padding-top: 18px;">
          <el-pagination :current-page="pages.pageNumber" :page-size="pages.pageSize" :total="pages.pageTotal"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import "swiper/swiper-bundle.min.css";
import NoneJpg from '@/assets/none.jpg'
import { ajax } from '@/api/ajax'
import { mapGetters } from 'vuex';
import { change } from "tqr";
export default {
  name: "Dashboard",
  data() {
    return {
      list: [],
      NoneJpg,
      form: {
        type: 0,
        backupDay: 0,
      },
      rules: {
        type: change,
        backupDay: 1,
      },
      // 
      pages: {
        pageNumber: 1,
        pageSize: 10,
        pageTotal: 0,
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getSystemSet()
    this.getData()
  },
  mounted() {

  },
  methods: {
    getSystemSet() {
      ajax({
        url: "/system/config/api/getConfig",
      }).then(({ data }) => {
        const { backup, backupDay } = data.config;
        this.form = {
          type: backup,
          backupDay
        }
      })
    },
    getData() {
      this.$global.loading = true
      ajax({
        url: "/system/backup",
        data: {
          pageNumber: this.pages.pageNumber,
          pageSize: this.pages.pageSize
        }
      }).then(({ data }) => {
        const { list, total } = data || {}
        if (list) {
          try {
            this.list = list
          } catch (error) {
            this.list = []
          }
        }
        this.pages.pageTotal = total
      }).finally(() => {
        this.$global.loading = false
      })
    },
    handleSetBackup() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$global.loading = true
          ajax({
            url: '/system/backup/setBackup',
            type: 'PUT',
            data: this.form
          }).then(() => {
            this.$notify.success('定时备份设置成功')
          }).finally(() => {
            this.$global.loading = false
          })
        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });
    },
    handleBF() {

      this.$global.loading = true
      ajax({
        url: "/system/backup/backup",
      }).then(() => {
        this.$notify.success('数据备份成功')
        this.getData()
      }).finally(() => {
        this.$global.loading = false
      })
    },
    handleHF(data) {
      const { id } = data;
      this.$global.loading = true
      ajax({
        url: `/system/backup/restore/${id}`,
      }).then(() => {
        this.$notify.success('数据还原成功')
        window.location.reload()
      }).finally(() => {
        this.$global.loading = false
      })
    },
    handleDelete(data) {
      const { id } = data;
      this.$global.loading = true
      ajax({
        url: `/system/backup/${id}`,
        type: 'DELETE'
      }).then(() => {
        this.$notify.success('数据删除成功')
        this.getData()
      }).finally(() => {
        this.$global.loading = false
      })
    },
    /**
     * 表格默认分页更改事件
     */
    handleCurrentChange(i) {
      this.pages.pageNumber = i
      this.getData()
    },
    handleSizeChange(i) {
      this.pages.pageSize = i
      this.pages.pageNumber = 1
      this.getData()
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  .el-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
