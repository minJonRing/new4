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
    noBtns: rulesT.Array,
    otherBtns: rulesT.Array,
    selection: rulesT.Array,
  },
  data() {
    return {
      mixinConfig: {
        url: "/books",
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
          label: "类型",
          type: "select",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "题名",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "关键字",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "责任者",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "出版者",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "出版地",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
      ];
      this.tableParam = [
        {
          label: "封面", formatter: (row) => {
            return <el-image src={row.imageUrl}
              fit="cover" style={{ display: 'block', width: '90px', height: '60px' }}>
              <div slot="error" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                <i class="el-icon-picture-outline" style={{ fontSize: '16x' }}>加载失败</i>
              </div>
            </el-image>
          },
          width: 111
        },
        { label: "题名", prop: "title", 'show-overflow-tooltip': true, 'min-width': 200 },
        { label: "类型", prop: "docType" },
        { label: "第一责任者", prop: "firstResponsible" },
        { label: "出版者", prop: "publisher" },
        { label: "出版地", prop: "place" },
        {
          label: "出版时间", prop: "publishTime", formatter: (row) => {
            return row.publishTime.replace(/(?=T)|(?=\s).+/g, '').replace(/\-/g, ($1, i) => {
              if (i == 4) {
                return '年'
              } else if (i == 7) {
                return '月'
              }
            }) + '日'
          },
          width: 115
        },
      ];
    },
    getData(data) {
      this.$emit("getData", data);
    },
  },
};
</script>
