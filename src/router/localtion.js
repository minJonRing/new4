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
                hidden: true,
                meta: {
                    title: '用户查看'
                },
            }
        ]
    },
    {
        component: 'TopicLibrary',
        meta: {
            title: '专题库管理', icon: 'list',
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
                    title: '专题库添加'
                },
            },
            {
                component: 'TopicLibraryEdit',
                hidden: true,
                meta: {
                    title: '专题库编辑'
                },
            },
            {
                component: 'TopicLibrarySee',
                hidden: true,
                meta: {
                    title: '专题库查看'
                },
            }
        ]
    },
    {
        component: 'Book',
        meta: {
            title: '图书管理', icon: 'education',
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