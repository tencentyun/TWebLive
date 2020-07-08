const conversationModules = {
  state: {
    currentMessageList: [],
    currentLiveTips: [],
    chatInfo: {
      groupId: 'TWebLiveDeveloperHub',
      userId: '',
      userSig: '',
      sdkAppID: ''
    },
    likeCount:0     //点赞人数
  },
  getters: {

  },
  mutations: {

    setGroupId(state, data) {
      state.chatInfo.groupId = data
    },
    showLike(state, data) {
      state.likeCount += data
    },
    /**
     * 将消息插入当前会话列表
     * 调用时机：收/发消息事件触发时
     * @param {Object} state
     * @param {Message[]|Message} data
     * @returns
     */
    pushCurrentMessageList(state, data) {
      if (Array.isArray(data)) {
        state.currentMessageList = [...state.currentMessageList, ...data]
      } else  {
        state.currentMessageList = [...state.currentMessageList, data]
      }
    },
    pushCurrentTipsList(state, data) {
      let timer = null
      if (Array.isArray(data)) {
        state.currentLiveTips = [...state.currentLiveTips, ...data]
      } else  {
        state.currentLiveTips = [...state.currentLiveTips, data]
      }
      timer = setTimeout(()=>{
        state.currentLiveTips.shift()
      },2000)
      if (state.currentLiveTips.length ===0) {
        clearTimeout(timer)
      }
    },
    /**
     * 从当前消息列表中删除某条消息
     * @param {Object} state
     * @param {Message} message
     */
    reset(state) {
      Object.assign(state, {
        currentMessageList: [],
        currentLiveTips:[],
      })
    }
  },
  actions: {

  }
}

export default conversationModules
