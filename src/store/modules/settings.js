import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, fullScreen, menuSearch, resize, errorBtn } = defaultSettings

const state = {
  // 主题
  theme: variables.theme,
  // 显示设置按钮
  showSettings: showSettings,
  // 显示页面标签
  tagsView: tagsView,
  // 固定顶部信息
  fixedHeader: fixedHeader,
  // 显示右侧顶部标题-logo
  sidebarLogo: sidebarLogo,
  // 全屏按钮
  fullScreen,
  // 菜单搜索
  menuSearch,
  // 调整尺寸大小
  resize,
  // 错误日志
  errorBtn
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

