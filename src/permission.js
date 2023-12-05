import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { roles } from '@/router/localtion'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 不用登录能直接进入的页面
const whiteList = ['/login', '/register', '/forget', '/auth-redirect', '/authorization'] // no redirect whitelist

// 路由守卫 进入每个页面都会执行
router.beforeEach(async (to, from, next) => {
  // 加载进度条
  NProgress.start()
  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title)

  // 获取用户登录凭证token
  const hasToken = getToken()
  // 用户登录凭证是否存在
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 用户路由是否存在
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户登录信息
          // const { roles } = await store.dispatch('user/getInfo')
          await store.dispatch('user/getInfo')

          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 添加路由
          router.addRoutes(accessRoutes)
          // next 往下直接
          next({ ...to, replace: true })
        } catch (error) {
          //  用户信息获取错误 返回登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 白名单理由直接进入
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 回到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
