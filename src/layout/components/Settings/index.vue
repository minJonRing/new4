<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面样式设置</h3>

      <div class="drawer-item">
        <span>主题颜色</span>
        <ThemePicker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>开启标签栏</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定头部</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>左侧菜单LOGO</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>菜单搜索</span>
        <el-switch v-model="handleMenuSearch" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>全面按钮</span>
        <el-switch v-model="handleFullScreen" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>尺寸切换按钮</span>
        <el-switch v-model="handleResize" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示错误日志</span>
        <el-switch v-model="handleErrorBtn" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "../Template/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {};
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val,
        });
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val,
        });
      },
    },
    handleMenuSearch: {
      get() {
        return this.$store.state.settings.menuSearch;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "menuSearch",
          value: val,
        });
      },
    },
    handleFullScreen: {
      get() {
        return this.$store.state.settings.fullScreen;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fullScreen",
          value: val,
        });
      },
    },
    handleResize: {
      get() {
        return this.$store.state.settings.resize;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "resize",
          value: val,
        });
      },
    },
    handleErrorBtn: {
      get() {
        return this.$store.state.settings.errorBtn;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "errorBtn",
          value: val,
        });
      },
    },
  },
  methods: {
    themeChange(val) {
      console.log(val);
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
