<template>
  <div class="navbar">
    <div class="left">
      <Hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />

      <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <ErrorLog v-if="errorBtn" class="errLog-container right-menu-item hover-effect" />
        <Search v-if="menuSearch" id="header-search" class="right-menu-item" />
        <ScreenFull v-if="fullScreen" id="screenfull" class="right-menu-item hover-effect" />
        <SizeSelect v-if="resize" id="size-select" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="headJpg" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item divided>主页</el-dropdown-item>
          </router-link>
          <router-link to="/profile/index">
            <el-dropdown-item>我的信息</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="modify = true">
            <div>修改密码</div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="modify" width="400px" append-to-body>
      <ModifyPassword ref="ModifyPassword" />
      <span slot="footer">
        <el-button @click="modify = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Template/Breadcrumb";
import Hamburger from "./Template/Hamburger";
import ErrorLog from "./Template/ErrorLog";
import ScreenFull from "./Template/Screenfull";
import SizeSelect from "./Template/SizeSelect";
import Search from "./Template/HeaderSearch";
import ModifyPassword from "./Template/ModifyPassword";
import headJpg from '@/assets/head.jpg'
import { ajax } from '@/api/ajax';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    ScreenFull,
    SizeSelect,
    Search,
    ModifyPassword,
  },
  data() {
    return {
      headJpg,
      modify: false,
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "device",
      "fullScreen",
      "menuSearch",
      "resize",
      "errorBtn",
      "userInfo"
    ]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    handleChangePassword() {
      this.$refs.ModifyPassword.handleSubmit().then((data) => {
        this.$global.loading = true;
        ajax({
          url: '/password',
          method: 'put',
          data
        }).then(() => {
          this.modify = false
          this.$notify.success('修改成功')
        }).finally(() => {
          this.$global.loading = false;
        })
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }
  }

  .right-menu {
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
