<template>
  <div class="modify">
    <el-form :model="form" ref="form" :rules="rules" size="small">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model.trim="form.oldPassword" placeholder="请输入旧密码" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input :type="passwordType1" v-model.trim="form.password" placeholder="请输入6-16位密码，包含字母、数字、特殊符号" clearable>
          <el-button slot="append" @click="showPwd('passwordType1')">
            <svg-icon :icon-class="passwordType1 === 'password' ? 'eye' : 'eye-open'" />
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="再次新密码" prop="checkPassword">
        <el-input :type="passwordType2" v-model.trim="form.checkPassword" placeholder="请输入6-16位密码，包含字母、数字、特殊符号"
          clearable>
          <el-button slot="append" @click="showPwd('passwordType2')">
            <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { blur } from 'tqr'

export default {
  name: "List",
  components: {
  },
  data() {
    return {
      form: {
        oldPassword: "",
        password: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: blur,
        password: {
          required: true,
          validator: (rule, value, callback) => {
            const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,16}$/.test(value)
            if (!value || !reg) {
              return callback(new Error('请输入符合格式的密码'));
            }
            return new callback();
          },
          trigger: "blur"
        },
        checkPassword: {
          required: true,
          validator: (rule, value, callback) => {
            const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,16}$/.test(value)
            if (!value || !reg) {
              return callback(new Error('请输入符合格式的密码'));
            }
            if (value !== this.form.password) {
              return callback(new Error('2次密码输入不匹配'));
            }
            return new callback();
          },
          trigger: "blur"
        },
      },
      passwordType1: 'password',
      passwordType2: 'password',
    };
  },
  created() {

  },
  methods: {
    showPwd(type) {
      if (this[type] === "password") {
        this[type] = "";
      } else {
        this[type] = "password";
      }
    },
    // 登录接口
    handleSubmit(fn) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          fn && fn(this.form)
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.user {
  padding: 50px 0;
  background-color: #f5f5f5;

}
</style>