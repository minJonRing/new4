export const roles = [
    {
        component: 'User',
        meta: {
            title: '用户管理', icon: 'peoples',
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
            title: '内容管理', icon: 'education',
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
            title: '推荐管理', icon: 'star',
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
    {
        component: 'Set',
        meta: {
            title: '基础设置', icon: 'lock',
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
    },
]