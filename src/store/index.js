import Vue from 'vue'
import Vuex from 'vuex'
import conversation from './modules/conversation'
import user from './modules/user'
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current: Date.now(), // 当前时间
    intervalID: 0,
    message: undefined,
    tips:{
      status:false,
      content:'',
      title:''
    }
  },
  getters: {
    hidden(state) {
      // eslint-disable-next-line no-unused-vars
      const temp = state.current
      if (typeof document.hasFocus !== 'function') {
        return document.hidden
      }
      return !document.hasFocus()
    }
  },
  mutations: {
    startComputeCurrent(state) {
      state.intervalID = setInterval(() => {
        state.current = Date.now()
      }, 500)
    },
    stopComputeCurrent(state) {
      clearInterval(state.intervalID)
      state.intervalID = 0
    },
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || 'success',
        duration: options.duration || 2000, //2000
        offset: 40
      })
    },
    showTips(state, data) {
      state.tips.status = data.status
      state.tips.content = data.content
      state.tips.title = data.title || '提示'
    }
  },
  modules: {
    conversation,
    user
  }
})
