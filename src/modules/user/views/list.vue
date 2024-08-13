<template>
  <div class="box">
    <ListProT ref="list" :list="list" :mixinConfig="mixinConfig" :searchParam="searchParam" :tableParam="tableParam"
      :noBtns="noBtns" :otherBtns="otherBtns" :selection="selection" @getData="getData" :jump="false"
      @getJump="getJump" />
    <!--  -->
    <el-dialog title="用户信息" :visible.sync="show" width="600px">
      <div style="padding:12px 0">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="昵称">{{ userForm.nickName }}</el-descriptions-item>
          <el-descriptions-item label="账号">{{ userForm.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userForm.email }}</el-descriptions-item>
          <!-- <el-descriptions-item label="手机号码">18100000000</el-descriptions-item> -->
          <!--  -->
          <!-- <el-descriptions-item label="当前积分">122</el-descriptions-item>
          <el-descriptions-item label="用户等级">7</el-descriptions-item>
          <el-descriptions-item label="已下载/剩余量">222/2220</el-descriptions-item> -->
          <el-descriptions-item label="状态">正常</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer">
        <el-button @click="show = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { rulesT } from "tqr";
export default {
  name: "List",
  props: {
    noBtns: {
      type: Array,
      default: () => ['add', 'edit', 'see']
    },
    otherBtns: rulesT.Array,
    selection: rulesT.Array,
  },
  data() {
    return {
      mixinConfig: {
        url: "/user",
      },
      list: {},
      // 查询条件
      searchParam: [],
      // 表格表头、数据显示
      tableParam: [],
      // 
      show: false,
      userForm: {}
    };
  },
  computed: {
    ...mapGetters([]),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.searchParam = [
        {
          label: "昵称",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "账号",
          type: "input",
          option: {
            prop: "username",
            initValue: "",
          },
        },
      ];
      this.tableParam = [
        { label: "昵称", prop: "nickName" },
        { label: "账号", prop: "username" },
        // { label: "用户等级", prop: "username" },
        // { label: "当前积分", prop: "username" },
        { label: "邮箱", prop: "email" },
        { label: "手机号", prop: "phone" },
        {
          label: "状态", prop: "isDeleted", formatter: (row) => {
            return <el-tag type={row.isDeleted ? 'danger' : ''}>{row.isDeleted ? '禁用' : '正常'}</el-tag>
          },
          width: '100px'
        },
        {
          label: "创建时间", formatter: (row) => {
            return row.createTime.split('T')[0]
          },
          width: "160px"
        },
      ];
    },
    getData(data) {
      this.$emit("getData", data);
    },
    getJump({ handle, data }) {
      if (['see'].includes(handle)) {
        this.userForm = data
        this.show = true
      }
    }
  },
};
</script>
