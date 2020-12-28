// JSON.parse(localStorage.getItem('userInfo')) ||
const SDKAPPID = window.genTestUserSig('').SDKAppID
const playDomain = window.genTestUserSig('').playDomain
let defaultGroupId = ''
let defaultTitle = ''
let defaultUserInfo = {
  userId:'',
  userSig:''
}
try {
  if (localStorage.groupId) {
    defaultGroupId = localStorage.groupId
  }
} catch (e) {
  console.log(e)
}
try {
  if (localStorage.title) {
    defaultTitle = localStorage.title
  }
} catch (e) {
  console.log(e)
}
try {
  if (localStorage.userInfo || localStorage.userSig) {
    defaultUserInfo.userId = localStorage.userId,
    defaultUserInfo.userSig = localStorage.userSig

  }
} catch (e) {
  console.log(e)
}

const conversationModules = {
  state: {
    currentMessageList: [],
    currentLiveTips: [],
    liveDomain:'',
    playType: 'WebRTC',   //默认webRTC 播放，cdn
    showLogin: false, //是否展示登录
    fullPath:'',
    pushInfo:{
      playUrl:'',
      isPushing:false,
      title: defaultTitle,
      resolution:'720p'
    },
    chatInfo: {
      groupId: defaultGroupId,
      userId: defaultUserInfo.userId,
      userSig: defaultUserInfo.userSig,
      sdkAppID: SDKAPPID,
      liveDomainName: playDomain,
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
    setLiveDomain(state, data) {
      state.liveDomain = data
    },
    setPlayInfo(state, data) {
      state.pushInfo.playUrl = data
    },
    setIsPushing(state, data) {
      state.pushInfo.isPushing = data
    },
    setPusherInfo(state, data) {
      state.pushInfo.title = data.title
      state.pushInfo.resolution = data.resolution
      try {
        localStorage.title = data.title
      } catch (e) {
        console.log(e)
      }
    },
    setGroupId(state, data) {
      state.chatInfo.groupId = data

      try {
        localStorage.groupId = data
      } catch (e) {
        console.log(e)
      }
      // localStorage.setItem('userInfo', JSON.stringify(data))
      // 之后才是修改state中的状态
    },
    setPlayType(state, data) {
      state.playType = data
    },
    showLogin(state, data) {
      state.showLogin = data
    },
    setChatInfo(state, data) {
      // state.chatInfo.groupId = data.roomID

      state.chatInfo.userId = data.userID
      state.chatInfo.userSig = data.userSig
      state.chatInfo.resolution = data.resolution
      try {
        localStorage.userId = data.userID
        localStorage.userSig = data.userSig

      } catch (e) {
        console.log(e)
      }
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
