<template>
  <div class="dashboard-container">
    <el-card shadow="always" :body-style="{ padding: '12px' }" style="margin-bottom:24px ;">
      <h5 style="font-size: 20px;margin:0">欢迎用户：{{ userInfo.usernick || userInfo.username }}，登录系统</h5>
    </el-card>
  </div>
</template>

<script>
import "swiper/swiper-bundle.min.css";
import NoneJpg from '@/assets/none.jpg'
import { ajax } from '@/api/ajax'
import { mapGetters } from 'vuex';
export default {
  name: "Dashboard",
  data() {
    return {
      list: [],
      NoneJpg
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {}
</style>
