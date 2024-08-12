<template>
  <div class="box">
    <ListProT ref="list" :list="list" :mixinConfig="mixinConfig" :searchParam="searchParam" :tableParam="tableParam"
      :noBtns="noBtns" :otherBtns="otherBtns" :selection="selection" @getData="getData" />
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
      default: () => ['add', 'edit']
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
        // { label: "状态", prop: "phone" },
        {
          label: "创建时间", formatter: (row) => {
            return row.createTime.split('T')[0]
          }
        },
      ];
    },
    getData(data) {
      this.$emit("getData", data);
    },
  },
};
</script>
