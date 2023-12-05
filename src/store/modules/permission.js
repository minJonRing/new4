import { constantRoutes, asyncRoutes, devComponent, routeAll } from '@/router'


// 根据服务器返回路由 根据本地 路由数据生产用户路由
const generateRoute = (routes = routeAll) => {
  return routes.map(el => {
    const { component, children } = el;
    const routeOption = devComponent[component]
    const routePath = routeOption.path
    const routeComponent = routeOption.component
    const obj = {
      ...el,
      name: component,
      path: routePath,
      component: routeComponent,
    }
    if (children && children.length) {
      return {
        ...obj,
        name: component + Date.now(),
        children: generateRoute(children)
      }
    } else {
      delete obj.children
      return obj
    }
  })
}

// 存储路由的数据
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}



const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 获取生成的路由
      const accessedRoutes = [...generateRoute(roles), ...asyncRoutes]
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
