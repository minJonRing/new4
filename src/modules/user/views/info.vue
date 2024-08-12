<template>
  <div class="info">
    <el-descriptions :column="3" border size="small">
      <el-descriptions-item label="昵称">kooriookami</el-descriptions-item>
      <el-descriptions-item label="账号">18100000000</el-descriptions-item>
      <el-descriptions-item label="邮箱">1014080407@qq.com</el-descriptions-item>
      <el-descriptions-item label="手机号码">18100000000</el-descriptions-item>
      <!--  -->
      <el-descriptions-item label="当前积分">122</el-descriptions-item>
      <el-descriptions-item label="用户等级">7</el-descriptions-item>
      <el-descriptions-item label="已下载/剩余量">222/2220</el-descriptions-item>
      <el-descriptions-item label="状态">正常</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <btn-return />
  </div>
</template>

<script>
import infoMixin from "@/mixin/infoMixin";
import {
  rulesT,
  blur,
  change,
  blurPhoneNotRequired,
  blurEmailNotRequired
} from "tqr";
import { ajax } from "@/api/ajax";

export default {
  name: "Info",
  mixins: [infoMixin],
  props: {
    read: rulesT.Boolean,
  },
  data() {
    return {
      id: null,
      mixinConfig: {
        url: "/user",
      },
      list: {
        roleList: []
      },
      form: {
        avatar: '',
      },
      formList: [],
      rules: {
        // nickName: blurName,
        username: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        checkPassword: blur,
        phone: blurPhoneNotRequired,
        email: blurEmailNotRequired,
        roleId: change
      },
    };
  },
  created() {
    this.getJS()
    const { id } = this.$route.query;
    this.id = id
    if (id) {
      this.getDetail(id).then(({ user }) => {
        this.init()
        this.form = user;
      })
    } else {
      this.init()
    }
  },
  methods: {
    init() {
      const isRead = this.read;
      this.formList = [
        {
          type: "box",
          className: "flex flex-mid flex-wrap",
          children: [
            {
              label: "名字",
              type: "input",
              option: {
                prop: "nickName",
                isRead,
                initValue: "",
                maxlength: 10
              },
            },
            {
              label: "职位",
              type: "input",
              option: {
                prop: "username",
                isRead,
                initValue: "",
              },
            },

            {
              label: "出生年月",
              type: "input",
              option: {
                prop: "checkPassword",
                isRead,
                initValue: "",
              },
            },
          ],
        },
        {
          type: "box",
          className: "flex flex-mid flex-wrap",
          children: [
            {
              label: "处室",
              type: "select",
              option: {
                prop: "password",
                isRead,
                initValue: "",
              },
            },
            {
              label: "职称",
              type: "input",
              option: {
                prop: "phone",
                isRead,
                initValue: "",
              },
            },
            {
              label: "政治面貌",
              type: "select",
              option: {
                prop: "roleId",
                isRead,
                initValue: "",
                list: [
                  { value: 1, label: '' }
                ]
              },
            },
          ]
        },
        {
          type: "box",
          className: "flex flex-mid flex-wrap",
          children: [
            {
              label: "毕业院校",
              type: "input",
              option: {
                prop: "roleId",
                isRead,
                initValue: "",
              },
            },
            {
              label: "专业",
              type: "input",
              option: {
                prop: "roleId",
                isRead,
                initValue: "",
              },
            },
            {
              label: "学位",
              type: "select",
              option: {
                prop: "roleId",
                isRead,
                initValue: "",
                list: [
                  { value: 1, label: '无' },
                  { value: 2, label: '学士' },
                  { value: 3, label: '学位' },
                  { value: 4, label: '博士' },
                ]
              },
            },
          ]
        },
        {
          label: "主持或完成的项目",
          type: "input",
          option: {
            prop: "roleId",
            type: 'textarea',
            isRead,
            initValue: "",
            listName: 'roleList',
            placeholder: '多个主持或完成的项目请用"；"来分隔',
            style: { width: '820px' }
          },
        },
        {
          label: "奖项及荣誉",
          type: "input",
          option: {
            prop: "roleId",
            type: 'textarea',
            isRead,
            initValue: "",
            listName: 'roleList',
            placeholder: '多个奖项及荣誉请用"；"来分隔',
            style: { width: '820px' }
          },
        },
      ];
      this.form = { ...this.form, ...this.initForm(this.formList) };
    },
    getJS() {
      this.$global.loading = true
      ajax({ url: "/role" })
        .then(({ data }) => {
          const { list } = data;
          this.list.roleList = list.map(({ id, roleName }) => ({ value: id, label: roleName }));
        })
        .finally(() => {
          this.$global.loading = false
        });
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { password, checkPassword } = this.form
          if (this.id) {
            const { id, avatar, nickName, phone } = this.form
            const data = { id, avatar, nickName, phone };
            this.submit(data);
          } else if (password === checkPassword) {
            const data = { ...this.form };
            this.submit(data);
          } else {
            this.$notify.warning('2次密码不一致')
          }

        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });
    },
  },
};
</script>
