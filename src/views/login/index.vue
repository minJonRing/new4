<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h2 class="title">{{ title }}</h2>
        <h6 class="title-sub">用户登录</h6>
      </div>
      <el-form-item prop="username">
        <el-input ref="username" v-model.trim="form.username" placeholder="请输入用户名" name="username" type="text"
          tabindex="1" autocomplete="on" clearable size="small">
          <span class="svg-container" slot="prepend">
            <svg-icon icon-class="user" />
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input :key="passwordType" ref="password" v-model.trim="form.password" :type="passwordType"
          placeholder="Password" name="password" tabindex="2" autocomplete="on" clearable @keyup.native="checkCapslock"
          @blur="capsTooltip = false" @keyup.enter.native="handleLogin" size="small">
          <span class="svg-container" slot="prepend">
            <svg-icon icon-class="password" />
          </span>
          <el-button slot="append" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width: 100%" size="small" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="username-help">
          <router-link to="/register">
            <el-button type="text">还没有账号?马上注册!</el-button>
          </router-link>
          <!-- <router-link to="/forget">
            <el-button type="text" style="color: #e6a23c">忘记密码</el-button>
          </router-link> -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { title } from '@/settings'
import { blur } from "tqr";
export default {
  name: "Login",
  data() {
    return {
      title,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: blur,
        // password: blur,
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.form.username === "") {
      this.$refs.username.focus();
    } else if (this.form.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 登录接口
    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 调取 登录接口  存储用户登录token
          this.$store
            .dispatch("user/login", this.form)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  height: 100vh;
  background: #92d2ee url('../../assets/loginBg.jpg');
  background-size: cover;

  .login-form {
    float: right;
    position: relative;
    width: 460px;
    max-width: 100%;
    padding: 160px 35px 0;
    overflow: hidden;
    background-color: #fff;
    height: 100%;
    clear: both;

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }

      .title-sub {
        font-size: 16px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .username-help {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
  }
}
</style>
