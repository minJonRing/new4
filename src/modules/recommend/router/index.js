import Layout from '@/layout'
export const route = {
  component: 'Recommend',
  meta: {
    title: '推荐图书',
    icon: 'education'
  },
  children: [
    {
      component: 'RecommendList',
      meta: {
        title: '推荐图书'
      },
    },
  ]
}

export const component = {
  Recommend: {
    path: '/recommend',
    component: Layout,
  },
  RecommendList: {
    path: 'list',
    component: () => import('@/modules/recommend/views/list'),
  },
}

export default {
  route,
  component
}