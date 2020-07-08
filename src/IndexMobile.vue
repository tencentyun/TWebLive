<template>
    <div class="container-mobile">
        <div id="video-container" class="video-box" ref="video"></div>
        <div class="live-title">
            <span v-for="(item,index) in tabs" :key="index" class="title-item" :class="{active:isActive[index]}" @click="tabClick(index)">{{item}}</span>
        </div>
        <div class="login-container" v-if="isLogin" >
          <login/>
        </div>
        <div ref="chat" class="chat">
            <newChat v-show="!this.tabSelected" ref="live"/>
            <div class="tab-summary" v-show="this.tabSelected">
                <p class="summary-text">腾讯云 Web 直播互动组件，以腾讯云 Web 超级播放器 - TcPlayer 和腾讯云即时通信 IM - TIM 为基础，封装了简单易用的 API，提供了免费开源的 Demo，方便开发者快速接入和使用。适用于 Web 直播互动场景，如大型会议、活动、课程、讲座等的在线直播，带货直播的微信 H5 分享等。</p>
            </div>
        </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Vue from 'vue'
  import newChat from './components/message/chat-mobile'
  import Login from './components/user/login'
  import MTA from './utils/mta'
  import {isMobile} from './utils/mobile'
  import { getUrlKey,IsValidFlv } from './utils/common'
  import bg from './assets/image/video-bg.png'


  export default {
    title: 'TWebLive DEMO',
    components: {
      Login,
      newChat
    },
    data() {
      return {
        isActive:[1,''],
        tabs:['互动','介绍'],
        tabSelected:0,  //互动
        options: {
          flv: 'https://3891.liveplay.myqcloud.com/live/yqtest.flv',
          m3u8: 'https://3891.liveplay.myqcloud.com/live/yqtest.m3u8',
          autoplay: true,
          x5_type:'h5',
          width: '100%',
          height: '230',
          poster: {style:'cover', src:bg},
          pausePosterEnabled: false,
          wording: {
            1:'主播不在，先在直播间聊聊天吧~ ',
            2:'主播不在，先在直播间聊聊天吧~ ',
            4:'主播不在，先在直播间聊聊天吧~ ',
            13:'您观看的直播已结束',
            2032: '请求视频失败，请检查网络',
            2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
          }
        },
        tweblive:null,
        isJoined:false,
        isMobile:isMobile()
      }

    },
    created() {
      let url = window.location.href
      let roomId  = getUrlKey('roomid',url)
      if(roomId) {
        this.$store.commit('setGroupId',roomId)
      }
      let flv = getUrlKey('flv',url)
      if(flv && IsValidFlv(flv)) {
        let m3u8 = flv.replace('flv','m3u8')
        this.options.flv = flv
        this.options.m3u8 = m3u8
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
      // 是否显示 Loading 状态
      showLoading() {
        return !this.isJoined
      }
    },

    mounted() {
      // 初始化监听器
      this.$nextTick(() => {
        const videoHeight = document.getElementById('video-container').clientHeight  //document.querySelector('video-container');
        let height = document.documentElement.clientHeight
        if(videoHeight < height / 2) { //超过一半高度
          this.$refs.chat.style.height = height - videoHeight  + 'px'
        } else {
          this.$refs.chat.style.height = height - videoHeight  + 'px'
        }

      })

      window.addEventListener('unload', () => {
        this.logout()
      })
      this.initListener()

    },

    watch: {
      isLogin(next) {
        if (next) {
          MTA.clickStat('link_two', { show: 'true' })
        }
      }
    },

    methods: {
      tabClick(index) {
        // window.scroll(0, 0)    //切换tab，聊天区域滑到底部
        this.isActive = ['','']
        this.isActive[index] = 1
        this.tabSelected = index
        this.$nextTick(() => {
          this.$refs.live.keepMessageListOnButtom()
        })
      },
      initListener() {
        const tweblive = new this.TWebLive({
          SDKAppID: 1400187352,
          domID: 'video-container',
          ...this.options
        })
        this.tweblive = tweblive
        window.tweblive = tweblive
        Vue.prototype.tweblive = tweblive
        this.enterRoom()

        // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
        this.tweblive.on(this.TWebLive.EVENT.IM_READY, this.onReadyStateUpdate)
        // 被踢出
        this.tweblive.on(this.TWebLive.EVENT.KICKED_OUT, this.onKickedOut)
        // SDK内部出错
        this.tweblive.on(this.TWebLive.EVENT.ERROR, this.onError)
        // 收到自定义新消息
        this.tweblive.on(this.TWebLive.EVENT.CUSTOM_MESSAGE_RECEIVED, this.onCustomMessageReceived)
        // 收到文本新消息
        this.tweblive.on(this.TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
        // 加入直播间
        this.tweblive.on(this.TWebLive.EVENT.REMOTE_USER_JOIN, this.onRemoteUserJoin)
        // 离开直播间
        this.tweblive.on(this.TWebLive.EVENT.REMOTE_USER_LEAVE, this.onRemoteUserLeave)
        // 网络监测enterRoom
        this.tweblive.on(this.TWebLive.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
        // 推流结束
        this.tweblive.on(this.TWebLive.EVENT.ENDED, this.onLiveEnd)
      },
      onTextMessageReceived ({ data: messageList }) {
        messageList.forEach((message)=> {
          const userName = message.nick || message.from
          const avatar = message.avatar || this.userInfo.defaultImg
          message.nick = userName
          message.avatar = avatar
        })
        this.$store.commit('pushCurrentMessageList', messageList)
      },
      onCustomMessageReceived ({ data: messageList }) {
        this.$store.commit('showLike',messageList.length)
      },
      onRemoteUserJoin ({ data: messageList }) {
        messageList.forEach(function(message) {
          const userName = message.nick || message.payload.userIDList[0]
          message.payload.text = `${userName} 来了`
          // message.type = 'Live-tips'
        })
        this.$store.commit('pushCurrentTipsList', messageList)
      },
      onRemoteUserLeave ({ data: messageList }) {
        messageList.forEach(function(message) {
          const userName = message.nick || message.payload.userIDList[0]
          message.payload.text = `${userName} 走了`
          // message.type = 'Live-tips'
        })
        this.$store.commit('pushCurrentTipsList', messageList)
      },
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
          this.enterRoom()
          this.getMyProfile()
        }
      },
      getMyProfile() {
        this.tweblive.getMyProfile().then((res) => {
          this.userInfo.nickName = res.data.nick || this.userID
          this.userInfo.avatar = res.data.avatar || this.userInfo.defaultImg
        }).catch(()=>{
          // console.log('getMyProfile error:', imError)// 更新资料失败的相关信息
        })

      },
      // 加入直播间
      enterRoom() {
        this.tweblive.enterRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = true
        }).catch((imError)=>{
          if(imError.code === 10007) {
            this.$store.commit('showMessage', { type: 'error', message: '加入的群组不存在'})
          }
        })
      },
      exitRoom() {
        this.tweblive.exitRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = false
        })
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
      checkoutNetState(state) {
        switch (state) {
          case this.TWebLive.TYPES.NET_STATE_CONNECTED:
            return { message: '已接入网络', type: 'success' }
          case this.TWebLive.TYPES.NET_STATE_CONNECTING:
            return { message: '当前网络不稳定', type: 'warning' }
          case this.TWebLive.TYPES.NET_STATE_DISCONNECTED:
            return { message: '当前网络不可用', type: 'error' }
          default:
            return ''
        }
      },
      login() {
        this.$store.commit('toggleIsLogin', true)
        // this.$emit()
      },
      _logout() {
        this.tweblive.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },
      async logout() {
        if (this.isSDKReady) {
          await this.exitRoom()
          await this._logout()
          this.enterRoom()
        }
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
        this.$store.commit('toggleIsLogin', true)
        this.$store.commit('reset')
      }
    }
  }
</script>

<style scoped lang="stylus">
    .container-mobile {
        margin 0 auto
        overflow hidden
        .video-box{
            position relative
            overflow hidden
        }
        .live-title {
            display flex
            justify-content center
            height 40px
            line-height 40px
            color #ffffff
            text-align center
            margin 0 auto
            border-bottom 2px solid rgb(0, 0, 0,0.8)
            font-size 16px
            .title-item {
                display: block;
                width: 50px;
                margin 0 40px
            }
        }
        .login-container {
            display flex
            justify-content center
            align-items center
            flex-direction column
            //padding-top: 100px;
        }
        .chat {
            display flex
            justify-content center
            position relative
            height auto
            .summary-text {
                padding 5px 20px
                line-height 25px
                color #ffffff
            }
        }
    }

    .text-ellipsis {
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    }

    .active {
        border-bottom 2px solid #f5a623
        color #f5a623
    }


    /deep/ .vcp-player{
        width 100%
        position relative
    }
    /deep/ .vcp-bigplay{
        display none
    }
    /deep/ .vcp-error-tips {
        color #FFFFFF
        margin-top: -4.25em

    }
    /deep/ .vcp-panel-bg{
        opacity 0.5
    }
    .text-ellipsis {
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    }
</style>
