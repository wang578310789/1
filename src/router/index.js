import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

  const routes = [
    { path: '/', redirect: '/login' },// 一进入就显示登录
    { path: '/Login', component: Login },// 登录
    { path: '/Home', component: Home }// home
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // to 访问路径  from 来自哪个路径  next 放行的函数
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
