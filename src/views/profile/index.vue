<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="userInfo" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="baseInfo">
                <BaseInfo :user="userInfo" />
              </el-tab-pane>
              <el-tab-pane label="消费总额" name="basePrice">
                <BasePrice />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import BaseInfo from './components/baseInfo'
import BasePrice from './components/basePrice'

export default {
  name: 'Profile',
  components: { UserCard, BaseInfo, BasePrice },
  data() {
    return {
      user: {},
      activeTab: 'baseInfo'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {

  },
  methods: {
  }
}
</script>
