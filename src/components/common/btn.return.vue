<template>
  <el-button @click="handleReturn()">{{ name }}</el-button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "返回",
    },
    path: {
      type: String,
      default: "list",
    },
  },
  methods: {
    handleReturn() {
      this.$store
        .dispatch("tagsView/delView", this.$route)
        .then(({ visitedViews }) => {
          const latestView = visitedViews.slice(-1)[0];
          // if (latestView) {
          this.path
            ? this.$router.push(this.path)
            : this.$router.push(latestView.fullPath);
          // }
        });
    },
  },
};
</script>
