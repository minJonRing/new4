import Cookies from 'js-cookie'
import dayjs from 'dayjs'

const COMMON_ENUM = {
  SET_LOADING: 'SET_LOADING',
  SET_E_TYPE: 'SET_E_TYPE'
}
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  loading: false,
  guoqile: dayjs('2025-1-31').valueOf() - dayjs().valueOf() > 0 ? false : true
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  GUO_QI_LE: (state, bool) => {
    state.guoqile = bool
  },
  [COMMON_ENUM.SET_LOADING]: (state, data) => {
    state.loading = data
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setLoading({ commit }, data = true) {
    commit(COMMON_ENUM.SET_LOADING, data)
  },
  setGuoqile({ commit }, data) {
    commit('GUO_QI_LE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
