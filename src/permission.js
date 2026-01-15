import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

// 路由前置守卫
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      nProgress.done()
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles)
        // console.log(roles.menus)
        // console.log(asyncRoutes)
        const filterRoutes = asyncRoutes.filter(item => {
          // console.log(item.name)
          return roles.menus.includes(item.name)
        })
        // console.log(filterRoutes)
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])// 添加动态路由到路由表
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

// 路由后置守卫
router.afterEach((to, from) => {
  nProgress.done()
})
