import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)
const router = new Router({
  // mode: 'history',
  // base:'/tweblive-demo-test',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./pages/login/login')
    },

    {
      path: '/pusher',
      name: 'pusher',
      component: () => import(/* webpackChunkName: "group-tweblive" */ './pages/pusher/pusher')
    },
    {
      path: '/player',
      name: 'player',
      component: () => import(/* webpackChunkName: "group-tweblive" */'./pages/player/player')
    },
  ]
})
router.beforeEach((to, from, next) => {
  // 判断是否登录
  const outerPaths = ['/']
  let playType = to.query.type
  if (outerPaths.includes(to.path)) {   //进入登录页面
    next()
    return
  }
  if (playType !== 'cdn') {
    if (!store.state.user.isLogin ) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router
