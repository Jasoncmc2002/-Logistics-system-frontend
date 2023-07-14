import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

export const Layout = () => import("@/layout/index.vue");

export const Layoutcom = () => import("@/components/common/LayoutCom.vue");
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
	{
		path: "/signIn",
		component: () => import("@/views/login/signIn.vue"),
		meta: { hidden: true },
	},

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "homepage", affix: true },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },
	{
		path: "/company",
		redirect: "/companyindex",
		meta: {
			// true 就代表着要鉴权，如果为 false 就不需要
			requireAuth: false,
			keepAlive: true,
		},
		children: [
			{
				path: '/companyindex',
				name: 'index',
				component: () => import('@/views/companyIntroduction/IndexView.vue')
			},
			{
				path: '/product',
				name: 'product',
				component: () => import('@/views/companyIntroduction/ProductView.vue'),
			},
			{
				path: '/product/productId/:productId',
				name: 'productDetails',
				component: () => import("@/views/companyIntroduction/ProductDetailsView.vue")
			},
			{
				path: '/example',
				name: 'example',
				component: () => import('@/views/companyIntroduction/ExampleView.vue')
			},
			{
				path: '/news',
				name: 'news',
				component: () => import('@/views/companyIntroduction/NewsView.vue')
			},
			{
				path: '/news/newsId/:newsId',
				name: 'newsDetails',
				component: () => import('@/views/companyIntroduction/NewsDetailsView.vue')
			},
			{
				path: '/about',
				name: 'about',
				component: () => import('@/views/companyIntroduction/AboutView.vue')
			},
		],
	},

  // 外部链接
  /*{
        path: '/external-link',
        component: Layout,
        children: [
            {
                path: 'https://www.cnblogs.com/haoxianrui/',
                meta: { title: '外部链接', icon: 'link' }
            }
        ]
    }*/
  // 多级嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
