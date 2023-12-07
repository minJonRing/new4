import Layout from '@/layout'
export const route = {
  component: 'Set',
  meta: {
    title: '基础设置',
    icon: 'lock'
  },
  children: [
    {
      component: 'SetLogo',
      meta: {
        title: 'Logo设置'
      },
    },
    {
      component: 'SetCode',
      meta: {
        title: '二维码设置'
      },
    },
    {
      component: 'SetLink',
      meta: {
        title: '相关链接'
      },
    },
  ]
}

export const component = {
  Set: {
    path: '/set',
    component: Layout,
  },
  SetLogo: {
    path: 'logo',
    component: () => import('@/modules/set/views/logo'),
  },
  SetCode: {
    path: 'coed',
    component: () => import('@/modules/set/views/code'),
  },
  SetLink: {
    path: 'link',
    component: () => import('@/modules/set/views/link'),
  },
}

export default {
  route,
  component
}