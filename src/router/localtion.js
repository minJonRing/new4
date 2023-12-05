export const roles = [
    {
        component: 'User',
        meta: {
            title: '用户管理', icon: 'dashboard',
        },
        children: [
            {
                component: 'UserList',
                meta: {
                    title: '用户管理'
                },
            },
            {
                component: 'UserSee',
                hidden: true
            }
        ]
    },
    {
        component: 'Book',
        meta: {
            title: '内容管理', icon: 'dashboard',
        },
        children: [
            {
                component: 'BookList',
                meta: {
                    title: '内容管理'
                },
            },
            {
                component: 'BookAdd',
                hidden: true
            },
            {
                component: 'BookEdit',
                hidden: true
            },
            {
                component: 'BookSee',
                hidden: true
            }
        ]
    },
    {
        component: 'Recommend',
        meta: {
            title: '推荐管理', icon: 'dashboard',
        },
        children: [
            {
                component: 'RecommendList',
                meta: {
                    title: '推荐管理'
                },
            },
        ]
    },
]