import Layout from '@/layout'
export const route = {
  component: 'Book',
  meta: {
    title: '图书管理',
    icon: 'education'
  },
  children: [
    {
      component: 'BookList',
      meta: {
        title: '图书管理'
      },
    },
    {
      component: 'BookAdd',
      hidden: true,
      meta: {
        title: '图书新增'
      },
    },
    {
      component: 'BookEdit',
      hidden: true,
      meta: {
        title: '图书编辑'
      },
    },
    {
      component: 'BookSee',
      hidden: true,
      meta: {
        title: '图书查看'
      },
    }
  ]
}

export const component = {
  Book: {
    path: '/book',
    component: Layout,
  },
  BookList: {
    path: 'list',
    component: () => import('@/modules/book/views/list'),
  },
  BookAdd: {
    path: 'add',
    component: () => import('@/modules/book/views/add'),
  },
  BookEdit: {
    path: 'edit',
    component: () => import('@/modules/book/views/edit'),
  },
  BookSee: {
    path: 'see',
    component: () => import('@/modules/book/views/see'),
  }
}

export default {
  route,
  component
}