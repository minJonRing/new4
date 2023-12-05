<template>
  <div class="register">
    <el-card>
      <div slot="header" class="header">
        <span>忘记密码</span>
        <router-link to="/login">
          <el-button type="text"> 返回登录 </el-button>
        </router-link>
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <template v-if="active === 1">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              clearable
            />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="form.code" placeholder="请输入验证码" clearable>
              <el-button
                slot="append"
                :disabled="message !== '点击获取验证码'"
                @click="handleGetCode"
              >
                {{ message }}
              </el-button>
            </el-input>
          </el-form-item>
        </template>
        <template v-if="active === 2">
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入新密码"
              clearable
            />
          </el-form-item>
          <el-form-item label="再次输入新密码" prop="passwordA">
            <el-input
              v-model="form.passwordA"
              placeholder="请再次输入新密码"
              clearable
            />
          </el-form-item>
        </template>
        <el-button
          v-if="active === 1"
          style="width: 100%"
          type="primary"
          @click="handleNext"
        >
          下一步
        </el-button>
        <el-button
          v-if="active === 2"
          style="width: 100%"
          type="primary"
          @click="handleSubmit"
        >
          提交
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>
  
<script >
import { isNumber } from "lodash";
import { blur } from "tqr";
export default {
  name: "Register",
  data() {
    return {
      form: {
        phone: "",
        code: "",
        password: "",
        passwordA: "",
      },
      rules: {
        phone: blur,
        code: blur,
        password: blur,
        passwordA: blur,
      },
      message: "点击获取验证码",
      active: 1,
    };
  },
  methods: {
    handleGetCode() {
      if (this.message === "点击获取验证码") {
        this.message = 60;
        this.setMessage();
      }
    },
    setMessage() {
      if (!isNumber(this.message)) {
        return;
      }
      this.message--;
      setTimeout(this.setMessage, 1000);
      if (this.message === 0) {
        this.message = "点击获取验证码";
      }
    },
    handleNext() {
      this.active = 2;
    },
    handleSubmit() {
      this.active = 1;
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
  background: linear-gradient(90deg, #f6d365, #fda085);
  .el-card {
    width: 400px;
    transform: translateY(-20vh);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
  