import { mapState } from 'vuex'
import Vue from 'vue'
import { isMobile } from '../../../src/utils/mobile'

export const mixinPusher = {
  data() {
    return {
      form:{
        data:'',
        description:'',
        extension:''
      },
      timer_record: null,
      pusherTime: '00:00:00',
      isMobile: isMobile(),
      isPush: true,  //开始推流
      playUrl: {
        flv: '',
        cdnUrl: '',
      },

      cdnUrl:'',
      isMute: false,   //是否禁言
      isStartCamera: true,
      isPlay: true,
      isShow_playUrl: false
    }
  },

  computed: {
    ...mapState({
      chatInfo: state => state.conversation.chatInfo,
      currentMessageList: state => state.conversation.currentMessageList,
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      userID: state => state.user.userID
    }),
  },
  created() {
    //todo

    this.cdnUrl = window.location.origin + window.location.pathname + '#/player'
    console.log('cdn播放地址', this.cdnUrl)
  },
  mounted() {
    // 初始化监听器
    this.initListener()
    window.addEventListener('beforeunload', () => {
        this.logout()
      }
    )

  },
  methods: {
    openConfirm() {
      this.$confirm('观众正在观看直播哦，确定关闭直播么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.stopPush()
      }).catch(() => {
        this.$store.commit('showMessage', {
          message: '已取消关闭',
          type: 'info'
        })
      })
    },

    initListener() {
      const pusher = Vue.prototype.TWebLive.createPusher({
        userID: this.chatInfo.userId
      })
      window.pusher = pusher
      Vue.prototype.pusher = pusher
      this.setRenderView()
      this.pusher.on(this.TWebLive.EVENT.RTC_CONNECTION_STATE_CHANGED, this.onRTCConnectionStateChanged)
      this.pusher.on(this.TWebLive.EVENT.RTC_CLIENT_BANNED, this.onRTCClientBanned)
      this.pusher.on(this.TWebLive.EVENT.RTC_CLIENT_ERROR, this.onRTCError)
    },
    onRTCConnectionStateChanged(event) {
      console.log('demo pusher | onRTCConnectionStateChanged |', event)
    },
    onRTCClientBanned(event) {
      console.log('demo pusher | onRTCClientBanned |', event)
    },
    onRTCError(event) {
      console.log('demo pusher | onRTCError |', event)
    },

    //开启本地预览
    setRenderView() {
      this.pusher.setRenderView({
        elementID: 'video-container',
        audio: true,
        video: this.chatInfo.resolution
      }).then(() => {
        console.log('demo pusher | setRenderView | ok')
        this.isStartCamera = false
      }).catch((error) => {
        console.error('demo pusher | setRenderView | failed', error)
      })
    },
    startCamera() {
      this.pusher.startCamera().then(() => {
        this.isStartCamera = false
        console.log('pusher | startCamera | ok')
      }).catch((error) => {
        console.error('pusher | startCamera | failed', error)
      })
    },
    stopCamera() {
      this.pusher.stopCamera().then(() => {
        this.isStartCamera = true
        console.log('pusher | stopCamera | ok')
      }).catch((error) => {
        console.error('pusher | stopCamera | failed', error)
      })
    },
    startMicrophone() {
      this.pusher.startMicrophone().then(() => {
        this.isMute = false
        console.log('pusher | startMicrophone | ok')
      }).catch((error) => {
        console.error('pusher | startMicrophone | failed', error)
      })
    },
    stopMicrophone() {
      this.pusher.stopMicrophone().then(() => {
        this.isMute = true
        console.log('pusher | stopMicrophone | ok')
      }).catch((error) => {
        console.error('pusher | stopMicrophone | failed', error)
      })
    },
    //推流
    startPush() {
      let userID = this.chatInfo.userId
      let userSig = this.chatInfo.userSig
      let SDKAppID = this.chatInfo.sdkAppID
      let liveDomainName = '3891.liveplay.myqcloud.com'
      let streamID = `${SDKAppID}_${this.chatInfo.groupId}_${userID}_main` //sdkappid_roomid_userid_main
      let url = `room://livedomainname=${liveDomainName}&sdkappid=${SDKAppID}&roomid=${this.chatInfo.groupId}&userid=${this.chatInfo.userId}&usersig=${userSig}&streamid=${streamID}`
      this.ready = true
      this.startAnimation()
      this.pusher.startPush(url).then(() => {
        console.log('demo pusher | startPush | ok')
        this.timeRecord()
        this.isPush = false
        this.getLiveStreamURL()
        this.$store.commit('setIsPushing', true)
        this.$store.commit('showMessage', {
          message: '直播已开启哦~',
        })
        this.sendCustomMessage()
      }).catch((error) => {
        this.$store.commit('showMessage', { type: 'error', message: '推流失败，请重试哦~' })
        console.error('demo pusher | startPush | failed', error)
      })
    },
    timeout(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    async startAnimation() {
      let time = +new Date()
      await this.timeout(800)
      this.ready = false
      await this.timeout(800)
      this.go = true
      await this.timeout(800)
      this.go = false
      await this.timeout(500)
      if (this.data === null) {
        await this.timeout(500)
        //预留请求数据的时间，以防数据请求不到
      }
      let lastTime = +new Date()
      console.log(lastTime - time)
    },
    // 停止推流
    stopPush() {
      this.pusher.stopPush().then(() => {
        console.log('demo pusher | stopPush | ok')
        this.isPush = true
        this.$store.commit('setIsPushing', false)
        this.sendStopPush()
        clearInterval(this.timer_record)
      }).catch((error) => {
        console.error('demo pusher | stopPush | failed', error)
      })
    },
    sendCustomMessage() {
      this.form.data = 'startPush'
      this.form.description = ''
      this.form.extension = ''
      this.im.sendCustomMessage({
        roomID: this.chatInfo.groupId,
        priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
        data: this.form.data,
        description: this.form.description,
        extension: this.form.extension
      }).then(() => {
      })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    },
    sendStopPush() {
      this.im.stopPush({
        roomID: this.chatInfo.groupId,
        postscript: '直播结束了哦~'
      })

    },
    // 获取推流地址
    getLiveStreamURL() {
      let url = this.pusher.getLiveStreamURL()
      let type = 'cdn'
      this.playUrl.flv = url
      this.playUrl.cdnUrl = `${this.cdnUrl}?type=${type}&flv=${url}&roomid=${this.chatInfo.groupId}`
      this.$store.commit('setPlayInfo', this.playUrl.cdnUrl)
      console.log('demo pusher | getLiveStreamURL | ' + url, `cdn 观看：${this.playUrl.cdnUrl}`)
    },

    //mobile 显示二维码
    playHandler() {
      this.isShow_playUrl = true
    },
    // pc端跳转
    playClick() {
      this.isPlay = false
      window.open(this.playUrl.cdnUrl, '_blank')
    },
    // 计时器
    timeRecord() {
      let hour = 0
      let minute = 0
      let second = 0
      this.timer_record = setInterval(() => {
        second = parseInt(second) + 1
        if (second >= 60) {
          second = 0
          minute = parseInt(minute) + 1
        }
        if (minute >= 60) {
          minute = 0
          hour = parseInt(hour) + 1
        }
        let h = hour < 10 ? ('0' + hour) : hour
        let m = minute < 10 ? ('0' + minute) : minute
        let s = second < 10 ? ('0' + second) : second
        this.pusherTime = h + ':' + m + ':' + s

      }, 1000)
    },
  }
}
