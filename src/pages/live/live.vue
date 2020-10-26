<template>
    <div class="live-box">
        <liveList/>
        <transition v-if="isMobile"
                name="custom-classes-transition"
                enter-active-class="animated  fadeInRight"
                leave-active-class="animated fadeOutRight"
        >
            <router-view></router-view>
        </transition>
        <router-view v-else></router-view>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import liveList from '../../components/liveList/liveList'
  import { isMobile } from '../../../src/utils/mobile'

  export default {
    name: 'live',
    components: {
      liveList
    },
    data() {
      return {
        isMobile:isMobile()
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
    },
    mounted() {
      let share_Url = window.location.origin + window.location.pathname + '#/player'
      this.$store.commit('setLiveDomain', share_Url)
      this.initListener()
    },
    methods: {
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
          // if (this.getStartPushMsg(message)) {
          //   let content = `${message.nick} 小主的直播已开始哦~`
          //   this.ShowTips(content)
          // }
        })
        // this.$store.commit('pushCurrentMessageList', messageList)
      },
      onRemoteUserJoin({ data: messageList }) {
        // 匿名加入群组，没有进群的消息提示
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
          this.$bus.$emit('onIsSDKReady') // 事件派发
         // this.createRoom()
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
    }
  }
</script>

<style lang="stylus" scoped>
    .live-box{
        height: 100vh;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
