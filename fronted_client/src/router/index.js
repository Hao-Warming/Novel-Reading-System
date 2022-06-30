import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/main/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/bookshelf',
    component: Main,
    children: [{
      path: 'bookshelf',
      name: "Bookshelf",
      component: () =>
        import("@/views/main/Bookshelf.vue"),
      // meta: { auth: true },
    },
    {
      path: 'type',
      name: 'Type',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/Type.vue'),
    },
    {
      path: 'center',
      name: 'Center',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/Center.vue')
    },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '@/views/register')
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import(/* webpackChunkName: "about" */ '@/views/book')
  },
  {
    path: '/comment',
    name: 'Comment',
    component: () => import(/* webpackChunkName: "about" */ '@/views/comment'),
    meta: { auth: true },
  },
  {
    path: '/chapter',
    name: 'Chapter',
    component: () => import(/* webpackChunkName: "about" */ '@/views/chapter')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "about" */ '@/views/detail')
  },
  {
    path: '/safety',
    name: 'Safety',
    component: () => import(/* webpackChunkName: "about" */ '@/views/safety'),
    meta: { auth: true },
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import(/* webpackChunkName: "about" */ '@/views/message'),
    meta: { auth: true },
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import(/* webpackChunkName: "about" */ '@/views/info'),
    meta: { auth: true },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '@/views/search')
  },
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


export default router
