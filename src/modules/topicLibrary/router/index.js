import Layout from '@/layout'
export const route = {
  component: 'TopicLibrary',
  meta: {
    title: '专题库',
    icon: 'list'
  },
  children: [
    {
      component: 'TopicLibraryList',
      meta: {
        title: '专题库管理'
      },
    },
    {
      component: 'TopicLibraryAdd',
      hidden: true,
      meta: {
        title: '专题库-新增'
      },
    },
    {
      component: 'TopicLibraryEdit',
      hidden: true,
      meta: {
        title: '专题库-编辑'
      },
    },
    {
      component: 'TopicLibrarySee',
      hidden: true,
      meta: {
        title: '专题库-查看'
      },
    }
  ]
}

export const component = {
  TopicLibrary: {
    path: '/topic-library',
    component: Layout,
  },
  TopicLibraryList: {
    path: 'list',
    component: () => import('@/modules/topicLibrary/views/list'),
  },
  TopicLibraryAdd: {
    path: 'add',
    component: () => import('@/modules/topicLibrary/views/add'),
  },
  TopicLibraryEdit: {
    path: 'edit',
    component: () => import('@/modules/topicLibrary/views/edit'),
  },
  TopicLibrarySee: {
    path: 'see',
    component: () => import('@/modules/topicLibrary/views/see'),
  }
}

export default {
  route,
  component
}