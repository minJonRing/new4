import Layout from '@/layout'
export const route = {
  component: 'User',
  meta: {
    title: '用户管理',
    icon: 'peoples'
  },
  children: [
    {
      component: 'UserList',
      meta: {
        title: '用户管理'
      },
    },
    {
      component: 'UserAdd',
      hidden: true,
      meta: {
        title: '用户-新增'
      },
    },
    {
      component: 'UserEdit',
      hidden: true,
      meta: {
        title: '用户-编辑'
      },
    },
    {
      component: 'UserSee',
      hidden: true,
      meta: {
        title: '用户-查看'
      },
    }
  ]
}

export const component = {
  User: {
    path: '/user',
    component: Layout,
  },
  UserList: {
    path: 'list',
    component: () => import('@/modules/user/views/list'),
  },
  UserAdd: {
    path: 'add',
    component: () => import('@/modules/user/views/add'),
  },
  UserEdit: {
    path: 'edit',
    component: () => import('@/modules/user/views/edit'),
  },
  UserSee: {
    path: 'see',
    component: () => import('@/modules/user/views/see'),
  }
}

export default {
  route,
  component
}