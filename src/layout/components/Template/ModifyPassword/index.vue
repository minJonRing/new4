<template>
  <div class="modify-password">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px">
      <!-- <el-form-item label="旧密码" prop="a">
        <el-input v-model.trim="form.a" placeholder="请输入旧密码" clearable />
      </el-form-item> -->
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model.trim="form.password"
          @input="e => form.password = e.replace(/[^0-9a-zA-Z]/g, '')" placeholder="请输入新密码" clearable />
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="checkPassword">
        <el-input type="password" v-model.trim="form.checkPassword"
          @input="e => form.checkPassword = e.replace(/[^0-9a-zA-Z]/g, '')" placeholder="请再次输入新密码" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ModifyPassword",
  data() {
    return {
      form: {
        password: "",
        checkPassword: "",
      },
      rules: {
        password: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        checkPassword: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
      },
    };
  },
  mounted() { },
  methods: {
    handleSubmit() {
      return new Promise((r) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { password, checkPassword } = this.form;
            if (password === checkPassword) {
              r(this.form);
            } else {
              this.$notify.warning('2次密码不一致')
            }
          } else {
            return false;
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.modify-password {
  padding: 18px 0 0;
}
</style>
