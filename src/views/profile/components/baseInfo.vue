<template>
  <el-form :model="form" ref="form" :rules="rules">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model.trim="form.nickName" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model.trim="form.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleUpdateInfo">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  rulesT,
  blur,
  blurPhoneNotRequired,
} from "tqr";
import { mapActions } from 'vuex';
import { ajax } from '@/api/ajax';
export default {
  props: {
    user: rulesT.Object
  },
  data() {
    return {
      form: {
        nickName: '',
        phone: ''
      },
      rules: {
        nickName: blur,
        phone: blurPhoneNotRequired,
      }
    }
  },
  created() {
    this.form = { ...this.form, ...this.user }
  },
  methods: {
    ...mapActions({ setInfo: 'user/setInfo' }),
    handleUpdateInfo() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$global.loading = true;
          const { nickName, phone } = this.form
          ajax({
            url: '/updateInfo',
            method: 'put',
            data: { nickName, phone }
          }).then(() => {
            this.$notify.success('修改成功,信息将在重新登录后同步')
            this.setInfo(this.form)
          }).finally(() => {
            this.$global.loading = false;
          })
        } else {
          return false;
        }
      });

    }
  }
}
</script>
