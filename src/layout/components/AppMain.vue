<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      console.log(this.$store.state.tagsView.cachedViews)
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.app-main {
  /* 50= navbar  50  */
  height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 12px;
  // background-color: $background;

  &>div {
    // background-color: rgba(248, 239, 230, 1);
    // background-color: rgba(250, 239, 220, .5);
    border-radius: 4px;
    padding: 12px;
    height: 100%;
    overflow: auto;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .2);


  }
}

.fixed-header+.app-main {
  padding-top: 62px;
}

.hasTagsView {
  // .app-main {
  //   /* 84 = navbar + tags-view = 50 + 34 */
  //   height: 100%;
  // }

  .fixed-header+.app-main {
    min-height: 100vh;
    padding-top: 96px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
