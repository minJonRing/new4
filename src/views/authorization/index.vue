<template>
  <div class="login-container">
    <div v-if="loading">
      <div class="tip">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
      </div>
      <div class="jz">授权登录成功中......</div>
    </div>
  </div>
</template>

<script>
import { Notification } from "element-ui";
export default {
  name: "Login",
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    let token = new URLSearchParams(document.location.search.substring(1)).get(
      "code"
    );
    if (token) {
      this.loading = true;
      this.$store
        .dispatch("user/authorizationMh", { isAjax: true, token })
        .then((res) => {
          try {
            Notification.success("授权登录成功");
            const { origin, pathname } = window.location;
            window.open(origin + pathname);
            setTimeout(() => {
              window.close();
            }, 600);
          } catch (error) {}
        })
        .catch(() => {
          Notification.warning("授权失败，请手动登录,3秒后关闭页面");
          setTimeout(() => {
            window.close();
          }, 3000);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .tip {
    font-size: 0;
    div {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin: 0 6px;
      &.d1 {
        background-color: red;
        animation: 4000ms d1 infinite;
      }
      &.d2 {
        background-color: orange;
        animation: 4000ms d2 infinite;
      }
      &.d3 {
        background-color: blue;
        animation: 4000ms d3 infinite;
      }
      @keyframes d1 {
        0% {
          transform: translate(0, 0);
        }
        22% {
          transform: translate(28px, 0);
        }
        28% {
          transform: translate(28px, 0);
        }
        47% {
          transform: translate(56px, 0);
        }
        53% {
          transform: translate(56px, 0);
        }
        72% {
          transform: translate(28px, 0);
        }
        78% {
          transform: translate(28px, 0);
        }
        100% {
          transform: translate(0, 0);
        }
      }
      @keyframes d2 {
        0% {
          transform: translate(0, 0);
        }
        22% {
          transform: translate(-28px, 0);
        }
        53% {
          transform: translate(-28px, 0);
        }
        72% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(0, 0);
        }
      }
      @keyframes d3 {
        0% {
          transform: translate(0, 0);
        }
        28% {
          transform: translate(0, 0);
        }
        47% {
          transform: translate(-28px, 0);
        }
        78% {
          transform: translate(-28px, 0);
        }
        100% {
          transform: translate(0, 0);
        }
      }
    }
  }
  .jz {
    font-size: 13px;
    color: #666;
    margin-top: 12px;
    text-align: center;
  }
}
</style>
