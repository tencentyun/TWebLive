// import { SDKAPPID } from '../../../public/debug/GenerateTestUserSig'
const SDKAPPID = window.genTestUserSig('').SDKAppID
const conversationModules = {
  state: {
    currentMessageList: [],
    currentLiveTips: [],
    playType: 'WebRTC',   //默认webRTC 播放，cdn
    showLogin: false, //是否展示登录
    pushInfo:{
      playUrl:'',
      isPushing:false
    },
    chatInfo: {
      groupId: '',
      userId: '',
      userSig: '',
      sdkAppID: SDKAPPID,
      streamId: '',
      role: '',
      resolution: ''
    },
    likeCount: 0     //点赞人数
  },
  getters: {},
  mutations: {
    setRole(state, data) {
      state.chatInfo.role = data
    },
    setPlayInfo(state, data) {
      state.pushInfo.playUrl = data
    },
    setIsPushing(state, data) {
      state.pushInfo.isPushing = data
    },
    setGroupId(state, data) {
      state.chatInfo.groupId = data
    },
    setPlayType(state, data) {
      state.playType = data
    },
    showLogin(state, data) {
      state.showLogin = data
    },
    setChatInfo(state, data) {
      state.chatInfo.groupId = data.roomID
      state.chatInfo.userId = data.userID
      state.chatInfo.userSig = data.userSig
      state.chatInfo.role = data.role
      state.chatInfo.resolution = data.resolution
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
      } else {
        state.currentMessageList = [...state.currentMessageList, data]
      }
    },
    pushCurrentTipsList(state, data) {
      let timer = null
      if (Array.isArray(data)) {
        state.currentLiveTips = [...state.currentLiveTips, ...data]
      } else {
        state.currentLiveTips = [...state.currentLiveTips, data]
      }
      timer = setTimeout(() => {
        state.currentLiveTips.shift()
      }, 2000)
      if (state.currentLiveTips.length === 0) {
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
        currentLiveTips: [],
      })
    }
  },
  actions: {}
}

export default conversationModules
