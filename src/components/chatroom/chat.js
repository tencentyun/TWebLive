import { decodeText } from '../../utils/decodeText'
import { getFullDate } from '../../utils/date'
import { mapState } from 'vuex'
import {
  Input,
  Popover,
} from 'element-ui'
import Tips from '../base/tips'
import liveLike from '../../components/liveLike/liveLike'
import MessageStatusIcon from './message-status-icon.vue'
import { emojiMap, emojiName, emojiUrl } from '../../utils/emojiMap'
export const mixinChat = {
  props: ['scrollMessageListToButtom'],
  components: {
    ElInput: Input,
    ElPopover: Popover,
    liveLike: liveLike,
    MessageStatusIcon: MessageStatusIcon,
    Tips:Tips
  },
  data() {
    return {
      showMessage: true,
      isShowScrollButtomTips: false,
      tips: [],
      preScrollHeight: 0,
      messageContent: '',
      isSendCustomMessage: false,
      sendCustomDialogVisible: false,
      surveyDialogVisible: false,
      form: {
        data: '',
        description: '',
        extension: ''
      },
      rate: 5, // 评分
      suggestion: '', // 建议
      file: '',
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      showAtGroupMember: false,
      atUserID: '',
      focus: false,
    }
  },
  computed: {
    ...mapState({
      playType: state => state.conversation.playType,
      isSDKReady: state => state.user.isSDKReady,
      isLogin: state => state.user.isLogin,
      userInfo: state => state.user.userInfo,
      chatInfo: state => state.conversation.chatInfo,
      currentMessageList: state => state.conversation.currentMessageList,
      currentLiveTips: state => state.conversation.currentLiveTips,
      userID: state => state.conversation.chatInfo.userId
    }),
    contentList() {
      return (text) => {
        return decodeText(text)
      }

    },
    showTip() {
      if (this.currentLiveTips.length > 0) {
        return this.currentLiveTips[0]
      } else {
        return ''
      }
    },

    getGroupTipContent() {
      return (message) => {
        return message.payload.text
      }
    },
    getStartPushMsg() {
      return (message) => {
        return this.customMsg(message.type) && message.payload.data === 'startPush'
      }
    },
    getDate() {
      return (message) => {
        return getFullDate(new Date(message.time * 1000))
      }
    },
  },
  watch: {

  },
  updated() {
    this.keepMessageListOnButtom()

  },
  created() {

  },
  mounted() {

  },
  methods: {
    githubHandler() {
      window.open('https://github.com/tencentyun/TWebLive', '_blank')
    },
    initListener() {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.im.on(this.TWebLive.EVENT.IM_READY, this.onReadyStateUpdate)
      // 被踢出
      this.im.on(this.TWebLive.EVENT.IM_KICKED_OUT, this.onKickedOut)
      // 收到自定义新消息
      this.im.on(this.TWebLive.EVENT.IM_CUSTOM_MESSAGE_RECEIVED, this.onCustomMessageReceived)
      // 收到文本新消息
      this.im.on(this.TWebLive.EVENT.IM_TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
      // 加入直播间
      this.im.on(this.TWebLive.EVENT.IM_REMOTE_USER_JOIN, this.onRemoteUserJoin)
      // 离开直播间
      this.im.on(this.TWebLive.EVENT.IM_REMOTE_USER_LEAVE, this.onRemoteUserLeave)
      // 网络监测
      this.im.on(this.TWebLive.EVENT.IM_NET_STATE_CHANGED, this.onNetStateChanged)
      // 推流结束
      this.im.on(this.TWebLive.EVENT.IM_PUSH_STOPPED, this.onPushStopped)

    },
    // 没有昵称或者昵称为''或者""的，都用 userID 展示
    canIUseNick(nick) {
      if (nick && nick !== '""' && nick !== '\'\'') {
        return true
      }
      return false
    },
    // WEBLIVE 登录
    webLiveLogin() {
      this.im.login({
        userID: this.chatInfo.userId,
        userSig: this.chatInfo.userSig
      }).then(() => {
        console.log('IM login成功')
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.$store.commit('showMessage', { message: 'IM 登录失败', type: 'error' })
      })
    },
    // 直播开始推流和停止推流的通知
    ShowTips(content) {
      this.$store.commit('showTips', { status: true, content:content })
    },
    onPushStopped(event) {
      this.$store.commit('showTips', { status: true, content:event.data })
    },
    onTextMessageReceived({ data: messageList }) {
      messageList.forEach((message) => {
        message.nick = this.canIUseNick(message.nick) ? message.nick : message.from
        message.avatar = message.avatar || this.userInfo.defaultImg
      })
      this.$store.commit('pushCurrentMessageList', messageList)
    },
    // 点赞消息：like   推流停止：stopPush
    onCustomMessageReceived({ data: messageList }) {
      this.$store.commit('showLike', messageList.length)
      messageList.forEach((message) => {
        message.nick = this.canIUseNick(message.nick) ? message.nick : message.from
        if (this.getStartPushMsg(message)) {
          let content = `${message.nick} 小主的直播已开始哦~`
          this.ShowTips(content)
        }
      })
      // this.$store.commit('pushCurrentMessageList', messageList)
    },
    onRemoteUserJoin({ data: messageList }) {
      messageList.forEach((message) => {

        const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
        message.payload.text = `欢迎 ${userName} 进入直播间`
        message.type = 'Live-tips'
      })
      if (this.isMobile) {
        this.$store.commit('pushCurrentTipsList', messageList)
      } else {
        this.$store.commit('pushCurrentMessageList', messageList)
      }
    },
    onRemoteUserLeave({ data: messageList }) {
      messageList.forEach((message) => {
        const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
        message.payload.text = `${userName} 离开了直播间`
        message.type = 'Live-tips'
      })
      if (this.isMobile) {
        this.$store.commit('pushCurrentTipsList', messageList)
      } else {
        this.$store.commit('pushCurrentMessageList', messageList)
      }
    },
    onNetStateChanged() {},
    onError({ data }) {
      if (data.message !== '' && data.message !== 'Network Error') {
        // this.$store.commit('showMessage', {
        //   message: data.message,
        //   type: 'error'
        // })
      }
    },
    onReadyStateUpdate({ name }) {
      const isSDKReady = name === this.TWebLive.EVENT.IM_READY ? true : false
      this.$store.commit('toggleIsSDKReady', isSDKReady)
      if (isSDKReady) {
        if (this.chatInfo.role === 'pusher') {
          this.createRoom()
        } else {
          this.enterRoom()
        }
        this.getMyProfile()
      }
    },
    getMyProfile() {
      this.im.getMyProfile().then((res) => {
        this.userInfo.nickName = this.canIUseNick(res.data.nick) ? res.data.nick : this.userID,
        this.userInfo.avatar = res.data.avatar || this.userInfo.defaultImg
      }).catch(() => {
      })
    },
    createRoom() {
      let promise = this.im.createRoom({
        name: '我的直播间',
        roomID: this.chatInfo.groupId
      })
      promise.then((imResponse) => { // 创建成功
        console.log(`创建了直播间${this.chatInfo.groupId}`)
        this.enterRoom()
      }).catch((imError) => {
        // 10021:群组 ID 已被使用，请选择其他的群组 ID。
        // 10025:群组 ID 已被使用，并且操作者为群主，可以直接使用。
        if (imError.code === 10021 || imError.code === 10025) {
          this.enterRoom()
        }
      })
    },
    // 加入直播间
    enterRoom() {
      this.im.enterRoom(this.chatInfo.groupId).then((imResponse) => {
        const status = imResponse.data.status
        if (status === this.TWebLive.TYPES.ENTER_ROOM_SUCCESS || status === this.TWebLive.TYPES.ALREADY_IN_ROOM) {
          console.log(this.chatInfo.groupId, '成功加入直播间')

        }
      }).catch((imError) => {
        if (imError.code === 10007 || imError.code === 10015) {
          this.$store.commit('showMessage', { type: 'warning', message: '进入直播间失败' })
        }
      })
    },
    onLiveEnd() {
      this.$store.commit('showMessage', { type: 'warning', message: '直播已结束' })
    },
    onNetStateChange(event) {
      this.$store.commit('showMessage', this.checkoutNetState(event.data))
    },
    onKickedOut(event) {
      this.$store.commit('showMessage', {
        message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: 'error'
      })
      this.$store.commit('toggleIsLogin', false)
      this.$router.push('/')
      window.location.reload()
      // todo
      this.$store.commit('reset')
    },
    imgError(item) {
      item.avatar = require('../../assets/image/default.png')
    },
    kickedOutReason(type) {
      switch (type) {
        case this.TWebLive.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return '由于多实例登录'
        case this.TWebLive.TYPES.KICKED_OUT_MULT_DEVICE:
          return '由于多设备登录'
        case this.TWebLive.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return '由于 userSig 过期'
        default:
          return ''
      }
    },
    handleMobileInputFocus() {
      window.scroll(0, 400)
      this.focus = true
    },
    handleMobileInputBlur() {
      //this.sendTextMessage()

    },
    onScroll({ target: { scrollTop } }) {
      let messageListNode = this.$refs['message-list']
      if (!messageListNode) {
        return
      }
      if (this.preScrollHeight - messageListNode.clientHeight - scrollTop < 20) {
        this.isShowScrollButtomTips = false
      }
    },
    // 如果滚到底部就保持在底部，否则提示是否要滚到底部
    keepMessageListOnButtom() {
      let messageListNode = this.$refs['message-list']
      if (!messageListNode) {
        return
      }
      // 距离底部20px内强制滚到底部,否则提示有新消息
      if (this.preScrollHeight - messageListNode.clientHeight - messageListNode.scrollTop < 20) {
        this.$nextTick(() => {
          messageListNode.scrollTop = messageListNode.scrollHeight + 60
        })
        this.isShowScrollButtomTips = false
      } else {
        this.isShowScrollButtomTips = true
      }
      this.preScrollHeight = messageListNode.scrollHeight
    },
    reEditMessage(payload) {
      this.messageContent = payload
    },
    handleLine() {
      this.messageContent += '\n'
    },
    handleEnter() {
      this.sendTextMessage()
    },
    sendTextMessage() {
      window.scroll(0, 0)    //ios键盘回落
      // if (!this.showMessage) {
      //   this.showMessage = true
      // }
      if (this.messageContent === '' || this.messageContent.trim().length === 0) {
        this.messageContent = ''
        this.$store.commit('showMessage', {
          message: '不能发送空消息哦！',
          type: 'info'
        })
        return
      }
      let message = {
        payload: {
          text: ''
        }
      }
      message.nick = this.userInfo.nickName
      message.avatar = this.userInfo.avatar
      message.payload.text = this.messageContent
      message.type = 'TIMTextElem'
      message.status = 'unsend'
      message.to = this.chatInfo.groupId
      message.time = Date.now() / 1000
      this.$store.commit('pushCurrentMessageList', message)
      this.im.sendTextMessage({
        roomID: this.chatInfo.groupId,
        priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
        text: this.messageContent
      })
        .then(() => {
        })
        .catch(error => {
          message.status = 'fail'
          //JSON.stringify(error, ['message', 'code'])
          if (error.code === 80001) {
            error.message = '文本中可能包含敏感词汇'
          }
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
      this.messageContent = ''
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    chooseEmoji(item) {
      this.messageContent += item
    },
    // 消息区分
    leaveMsg(type) {
      return type === 'Live-tips'
    },
    textMsg(type) {
      return type === 'TIMTextElem'
    },
    joinMsg(type) {
      return type === 'Live-tips'
    },
    customMsg (type) {
      return type === 'TIMCustomElem'
    },
    checkLogin() {
      this.messageContent = ''
      this.$store.commit('showMessage', {
        message: '请先登录',
        type: 'warning'
      })
      this.$store.commit('showLogin', true)
    },
    tabClick(index) {
      // window.scroll(0, 0)    //切换tab，聊天区域滑到底部
      this.isActive = ['', '']
      this.isActive[index] = 1
      this.tabSelected = index
    },
  }

}
