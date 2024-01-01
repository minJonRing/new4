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
      default: () => []
    },
    otherBtns: rulesT.Array,
    selection: rulesT.Array,
  },
  data() {
    return {
      mixinConfig: {
        url: "/topicLibrary",
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
          label: "专题名称",
          type: "input",
          option: {
            prop: "name",
            initValue: "",
          },
        },
      ];
      this.tableParam = [

        {
          label: "封面", formatter: (row) => {
            return <el-image src={row.coverUrl}
              fit="cover" style={{ display: 'block', width: '90px', height: '60px' }}>
              <div slot="error" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                <i class="el-icon-picture-outline" style={{ fontSize: '16x' }}>加载失败</i>
              </div>
            </el-image>
          }, width: 110
        },
        { label: "专题名称", prop: "name" },
        { label: "创建者", prop: "creator", width: 100 },
      ];
    },
    getData(data) {
      this.$emit("getData", data);
    },
  },
};
</script>
