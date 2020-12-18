import { mapState } from 'vuex'
import Vue from 'vue'
import { isMobile } from '../../../src/utils/mobile'
import axios from 'axios'

export const mixinPusher = {
  data() {
    return {
      isTest: false,
      show_creat: false,
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
      isMute: false,   //是否禁言
      isStartCamera: true,
      set_RenderView:false,
      isPlay: true,
      isShow_playUrl: false
    }
  },

  computed: {
    ...mapState({
      liveDomain: state => state.conversation.liveDomain,
      chatInfo: state => state.conversation.chatInfo,
      currentMessageList: state => state.conversation.currentMessageList,
      pushInfo:state => state.conversation.pushInfo,
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      userID: state => state.user.userID
    }),
    title() {
      if (this.pushInfo.title === '') {
         this.pushInfo.title = `${this.userInfo.nickName}发布了直播`
         return `${this.userInfo.nickName}发布了直播`
      } else {
        return this.pushInfo.title
      }
    }
  },
  created() {
    this.show_creat = this.$route.params.create
    if (this.show_creat) {
      setTimeout(()=> {
        this.open()
      }, 800)
    }
    //this.creatLive()
    //todo
    if ( !this.isMobile ) {
      this.isTest = true
    }

    this.cdnUrl = 'https://' + window.location.host + window.location.pathname + '#/player'
  },
  mounted() {

    // 初始化监听器
    this.initListener()
    this.webLiveLogin(this.chatInfo.userId, this.chatInfo.userSig)
  },
  destroyed() {
    this.destroyLive()

  },
  methods: {
    webLiveLogin(userID, userSig) {
      this.im.login({
        userID: userID,
        userSig: userSig
      }).then(() => {
        console.log('im登录成功')
        // 区分移动端和PC
        if ( !this.isMobile ) {
          if (this.isSDKReady) {
            this.createRoom()
          } else {
            this.$bus.$once('onIsSDKReady', ()=> {
              this.createRoom()
            })
          }

        }
      }).catch((err) => {
        this.$store.commit('showMessage', { message: '登录失败', type: 'error' })
      })
    },
    creatLiveRoom() {
      this.creatLive()
    },
    createRoom() {
      let promise = this.im.createRoom({
        name: '我的直播间',
        roomID: this.chatInfo.groupId
      })
      promise.then((imResponse) => { // 创建成功
        console.log('创建成功', this.chatInfo.groupId)
        if (this.isMobile) {
          this.startPush()
        } else {
          this.enterRoom()
        }
      }).catch((imError) => {
        // 10021:群组 ID 已被使用，请选择其他的群组 ID。
        // 10025:群组 ID 已被使用，并且操作者为群主，可以直接使用。
        if (imError.code === 10021 || imError.code === 10025) {
          if (this.isMobile) {
            this.startPush()
          } else {
            this.enterRoom()
          }
          // this.enterRoom()
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
        if (this.isMobile) {   //移动端开播消息在加入群组之后发送
          this.sendCustomMessage()
        }
      }).catch((imError) => {
        if (imError.code === 10007 || imError.code === 10015) {
          this.$store.commit('showMessage', { type: 'warning', message: '进入直播间失败' })
        }
      })
    },
    openConfirm() {
      this.$confirm('观众正在观看直播哦，确定关闭直播么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         // this.destroyLive()
         this.$router.replace('/')
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
      if ( this.isMobile ) {
        setTimeout(() => {
          this.setRenderView()
        }, 1000)
      } else {
        this.setRenderView()

      }
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
        // 设置背景
       let el = window.document.getElementById('video-container').childNodes
        el[0].style.backgroundColor = 'rgba(0,0,0,0)'
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
      let liveDomainName = this.chatInfo.liveDomainName //'3891.liveplay.myqcloud.com' 配置的推流域名
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
        if (this.isMobile) {
          this.enterRoom()
        } else {
          this.sendCustomMessage()
        }
      }).catch((error) => {
        this.$store.commit('showMessage', { type: 'error', message: '推流失败，请重试哦~' })
        console.error('demo pusher | startPush | failed', error)
      })
    },
    // 移动端
     creatLive() {
      if (this.pushInfo.title === '') {
        this.pushInfo.title = `${this.userInfo.nickName}发布了直播`
      }
      let title = this.pushInfo.title
      axios (`https://service-62h5r0ea-1252463788.gz.apigw.tencentcs.com/release/forTestAdvanced?method=createRoom&appId=1400188366&type=liveRoom&title=${title}&anchorId=${this.chatInfo.userId}`)
        .then((res) => {
          console.log('移动端liveRoom创建成功', `roomId-${res.data.roomId}`, `title-${title}`)
          this.$store.commit('setGroupId', res.data.roomId)
          this.createRoom()
        })
        .catch(() => {
          this.$store.commit('showMessage', { message: '失败', type: 'error' })
        })
    },
    open() {
      this.$confirm('为了保证您的摄像头和麦克风可以正常使用，在开始直播前请您完成设备检测哦~', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isTest = true
      }).catch(() => {
        this.$store.commit('showMessage', {
          message: '已取消',
          type: 'info'
        })
      })
    },
    destroyLive() {
      axios (`https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/forTest?method=destroyRoom&appId=1400188366&type=liveRoom&roomId=${this.chatInfo.groupId}`)
        .then((res) => {
          console.log('销毁成功')
          if (!this.isPush) {
            this.stopPush()
          }
        })
        .catch(() => {
          this.$store.commit('showMessage', { message: '失败', type: 'error' })
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
      this.playUrl.cdnUrl = `${this.liveDomain}?type=${type}&anchorId=${this.chatInfo.userId}&roomid=${this.chatInfo.groupId}&title=${this.pushInfo.title}`
      this.$store.commit('setPlayInfo', this.playUrl.cdnUrl)
      console.log('demo pusher | getLiveStreamURL | ' + url, `cdn 观看：${this.playUrl.cdnUrl}`)
    },

    //mobile 显示二维码
    playHandler() {
      if (!this.isPush) {
        this.isShow_playUrl = true
      } else {
        this.$store.commit('showMessage', { message: '请先开启直播哦~', type: 'warning' })
      }

    },
    // pc端跳转
    playClick() {
      this.isPlay = false
      window.open(this.playUrl.cdnUrl, '_blank')
    },
    imgError(item) {
      item.avatar = require('../../assets/image/default.png')
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
