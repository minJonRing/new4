<template>
  <div class="register">
    <el-card>
      <div slot="header" class="header">
        <span>注册用户</span>
        <router-link to="/login">
          <el-button type="text"> 返回登录 </el-button>
        </router-link>
      </div>
      <el-form v-loading="loading" :model="form" ref="form" :rules="rules">
        <el-form-item label="用户名(数字,英文3-10位)" prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入用户名" maxlength="10" @input="handleInput" clearable />
        </el-form-item>
        <el-form-item label="密码(数字,英文3-10位)" prop="password">
          <el-input type="password" v-model.trim="form.password"
            @input="e => form.password = e.replace(/[^0-9a-zA-Z]/g, '')" placeholder="请输入密码" maxlength="10" clearable />
        </el-form-item>
        <el-form-item label="确认密码(数字,英文3-10位)" prop="checkPassword">
          <el-input type="password" v-model.trim="form.checkPassword"
            @input="e => form.checkPassword = e.replace(/[^0-9a-zA-Z]/g, '')" placeholder="请输入密码" maxlength="10"
            clearable />
        </el-form-item>
        <el-button style="width: 100%" type="primary" @click="handleSubmit">
          确认注册
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>
  
<script >
import { blur } from "tqr";
import { ajax } from '@/api/ajax';
export default {
  name: "Register",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
        checkPassword: ""
      },
      rules: {
        username: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        checkPassword: blur
      },
    };
  },
  methods: {
    handleInput(e) {
      this.form.username = e.replace(/[^0-9a-zA-Z]/g, '')
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { password, checkPassword } = this.form
          if (password === checkPassword) {
            this.loading = true;
            ajax({
              url: '/register',
              method: 'post',
              data: this.form
            }).then(() => {
              this.$notify.success('注册成功');
            }).finally(() => {
              this.loading = false
            })
          } else {
            this.$notify.warning('2次密码不一致')
          }
        } else {
          return false;
        }
      });

    },
  },
};
</script>
  
<style lang='scss' scoped>
.register {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(90deg, #1fa2ff, #12d8fa, #a6ffcb);

  .el-card {
    width: 400px;
    transform: translateY(-10vh);

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
  