import { mapState } from 'vuex'
import Vue from 'vue'
import bg from '../../assets/image/video-gb.png'
export const mixinPlayer = {
  data() {
    return {
      share_url:'',
      isShow_playUrl:false,
      timer_record: null,
      time_value:{
        hour:0,
        minute:0,
        second:0,
      },
      playerTime: '00:00:00',
      volumeValue: 70,
      showSetVolume: false,
      audioContent: '关闭麦克风',
      isMute: false,
      playContent: '暂停',
      isPlay: true,
      _timer:0,
      live_title:'',
      cdnPlayUrl:{
        flv:'',
        hls:''
      }
    }
  },
  computed: {
    ...mapState({
      chatInfo: state => state.conversation.chatInfo,
      playType: state => state.conversation.playType,
      currentMessageList: state => state.conversation.currentMessageList,
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      userID: state => state.user.userID
    }),
  },
  created() {
    this.cdnPlay()
    this.enterRoom()   //游客匿名加群
  },
  mounted() {
    // 初始化监听器
    this.initListener()
  },
  destroyed() {
    this.stopPlay()
  },
  methods: {

    cdnPlay() {
      // CDN  分享 播放
      this.$store.commit('setPlayType', 'cdn')
      let share_Url = window.location.origin + window.location.pathname + '#/player'

      let query = this.$route.query
      if (query.type === 'cdn') {
        let roomId  = query.roomid
        if (roomId) {
           this.$store.commit('setGroupId', roomId)
         }
      }
      let anchorId = this.$route.query.anchorId
      let playUrl = this.$route.query.playUrl
      this.live_title = this.$route.query.title
      let streamID = `${this.chatInfo.sdkAppID}_${this.chatInfo.groupId}_${anchorId}_main`
      this.cdnPlayUrl.flv = `https://${this.chatInfo.liveDomainName}/live/${streamID}.flv`
      this.cdnPlayUrl.hls = `https://${this.chatInfo.liveDomainName}/live/${streamID}.m3u8`
      if (playUrl) {
        this.cdnPlayUrl.flv = `${playUrl}.flv`
        this.cdnPlayUrl.hls = `${playUrl}.m3u8`
      }
      let play_url = `${share_Url}?type=cdn&anchorId=${anchorId}&roomid=${this.chatInfo.groupId}&title=${this.live_title}`
      this.share_url = play_url
      this.$store.commit('setPlayInfo', play_url)
    },

    // 加入直播间
    enterRoom() {
      this.im.enterRoom(this.chatInfo.groupId).then((imResponse) => {
        const status = imResponse.data.status
        if (status === this.TWebLive.TYPES.ENTER_ROOM_SUCCESS || status === this.TWebLive.TYPES.ALREADY_IN_ROOM) {
          console.log(this.chatInfo.groupId, '观众匿名加入直播间')

        }
      }).catch((imError) => {
        console.log('失败', imError)
        if (imError.code === 10007 || imError.code === 10015) {
          this.$store.commit('showMessage', { type: 'warning', message: '直播间可能已解散' })
        }
      })
    },
    initListener() {
      const player = Vue.prototype.TWebLive.createPlayer()
      window.player = player
      Vue.prototype.player = player
        this.player.setCustomConfig({
          autoplay: true,
          poster: { style:'cover', src:bg },
          pausePosterEnabled: false,
          wording: {
            1:'您观看的直播已结束哦~ ',
            2:'您观看的直播已结束哦~ ',
            4:'您观看的直播已结束哦~ ',
            13:'您观看的直播已结束',
            2032: '请求视频失败，请检查网络',
            2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
          }
        })
      this.setRenderView()
      // 播放时
      this.player.on(this.TWebLive.EVENT.PLAYER_PLAYING, this.onPlayerPlaying)
      // 暂停
      this.player.on(this.TWebLive.EVENT.PLAYER_PAUSE, this.onPlayerPause)
      // 浏览器不允许自动播放
      this.player.on(this.TWebLive.EVENT.PLAYER_AUTOPLAY_NOT_ALLOWED, this.onPlayerAutoPlayNotAllowed)
      this.player.on(this.TWebLive.EVENT.PLAYER_ERROR, this.onPlayerError)
    },
    onPlayerPlaying(event) {
      console.log('demo player | onPlayerPlaying |', event)
    },
    onPlayerPause(event) {
      console.log('demo player | onPlayerPause |', event)
    },
    onPlayerAutoPlayNotAllowed(event) {
      this.$store.commit('showMessage', {
        message: '不能自动播放',
        type: 'info'
      })
      console.log('demo player | onPlayerAutoPlayNotAllowed |', event)
    },
    onPlayerError(event) {
      console.log('demo player | onPlayerError |', event)
    },
    // 设置渲染界面
    setRenderView() {
      this.player.setRenderView({ elementID: 'player-container' })
      this.startPlay()
    },
    resumeAudio() {
      this.player.resumeAudio().then(() => {
        console.log('demo player | resumeAudio | ok')
        this.isMute = false
        this.audioContent = '关闭麦克风'
      }).catch((error) => {
        console.error('demo player | resumeAudio | failed', error)
      })
    },
    pauseAudio() {
      this.player.pauseAudio().then(() => {
        this.isMute = true
        this.audioContent = '打开麦克风'
        console.log('demo player | pauseAudio | ok')
      }).catch((error) => {
        console.error('demo player | pauseAudio | failed', error)
      })
    },
    //播放
    startPlay() {

      let userID = this.chatInfo.userId
      let userSig = this.chatInfo.userSig
      let SDKAppID = this.chatInfo.sdkAppID
      let roomID = this.chatInfo.groupId
      // let url = `room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`
      // if (this.playType === 'cdn') {
      //   url = `https://flv=${this.cdnPlayUrl.flv}&hls=${this.cdnPlayUrl.hls}`
      // }
      let url = `https://flv=${encodeURIComponent(this.cdnPlayUrl.flv)}&hls=${encodeURIComponent(this.cdnPlayUrl.hls)}`

      this.player.startPlay(url).then(() => {
        console.log('demo player | startPlay | ok')
        this.timeRecord()
        this.isPlay = true
        this.playContent = '暂停播放'
      }).catch((error) => {
        console.error('demo player | startPlay | failed', error)
      })
    },

    //暂停播放 {
    pauseVideo() {
      this.player.pauseVideo().then(() => {
        this.isPlay = false
        this.playContent = '开启播放'
        clearInterval(this.timer_record)
        console.log('demo player | pauseVideo | ok')
      }).catch((error) => {
        console.error('demo player | pauseVideo | failed', error)
      })
    },
    // 回复播放
    resumeVideo() {
      this.player.resumeVideo().then(() => {
        this.isPlay = true
        this.playContent = '暂停播放'
        this.timeRecord()
        console.log('demo player | resumeVideo | ok')
      }).catch((error) => {
        console.error('demo player | resumeVideo | failed', error)
      })
    },
    // 正在播放
    isPlaying() {
      return this.player.isPlaying()
    },
    //
    setPlayoutVolume() {
      // 关闭进度条
      clearTimeout(this._timer)
      this._timer = setTimeout(()=> {
        this.showSetVolume = false
      }, 3000)
      console.log('demo player | setPlayoutVolume', this.volumeValue)
      this.player.setPlayoutVolume(this.volumeValue)
    },
    // 停止播放
    stopPlay() {
      this.player.stopPlay()
      console.log('demo player | stopPlay | ok')
      clearInterval(this.timer_record)
      this.isPlay = false
    },
    shareHandler() {
      this.isShow_playUrl = true
    },
    // 计时器
    timeRecord() {
      let hour = this.time_value.hour
      let minute = this.time_value.minute
      let second = this.time_value.second
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
        this.time_value.hour = hour
        this.time_value.minute = minute
        this.time_value.second = second
        let h = hour < 10 ? ('0' + hour) : hour
        let m = minute < 10 ? ('0' + minute) : minute
        let s = second < 10 ? ('0' + second) : second
        this.playerTime = h + ':' + m + ':' + s

      }, 1000)
    },
  }
}
