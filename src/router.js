import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import live from './pages/live/live'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'live',
      component:live,
      children: [
        {
          path: 'pusher',
          name: 'pusher',
          component: () => import(/* webpackChunkName: "group-tweblive" */ './pages/pusher/pusher')
        },
        {
          path: 'player',
          name: 'player',
          component: () => import(/* webpackChunkName: "group-tweblive" */'./pages/player/player')
        },
        ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  // 判断是否登录
  if (to.fullPath === '/') {
    store.state.conversation.fullPath = '/'
  } else {
    store.state.conversation.fullPath = ''
  }
  next()

})

export default router
