import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

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
        await store.dispatch('user/getUserInfo')
      }
      next()
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
