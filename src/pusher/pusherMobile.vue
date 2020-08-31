<template>
  <div class="pusher-Mobile">
    <div id="video-container" class="video-container"></div>
    <div class="ready-go">
      <transition
          name="custom-classes-transition"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
      >
        <span class="ready-box" v-if="ready">Ready!</span>
        <span class="ready-box" v-if="go">Go!</span>
      </transition>
    </div>
    <div class="start-btn" @click="startPush" v-show="isPush">开始推流</div>
    <div class="room-time">
      <div>
        <img class="room-img" src="../assets/image/room-mobile.png"><span
          class="room-text">ID-{{chatInfo.groupId}}</span>
      </div>
      <div style="width: 93px">
        <img class="time-img" v-if="isPush" src="../assets/image/time-mobile.png">
        <img class="time-img" v-else src="../assets/image/pushing.png">
        <span class="room-text">{{pusherTime}}</span>
      </div>
    </div>
    <div class="setting-bar" v-show="!isPush">
      <div class="video-bar">
        <div>
          <!--                    打开麦克风-->
          <p class="setting-icon cursor" v-if="isMute" @click="startMicrophone">
            <img src="../assets/image/close-mcp.png">
          </p>
          <p class="setting-icon cursor" v-else @click="stopMicrophone">
            <img src="../assets/image/open-microphone.png">
          </p>
        </div>

        <div>
          <p class="setting-icon cursor" v-if="isStartCamera" @click="startCamera">
            <img src="../assets/image/close-camera.png">
          </p>
          <p class="setting-icon cursor" v-else @click="stopCamera">
            <img src="../assets/image/open-camera.png">
          </p>
        </div>

        <div>
          <p class="setting-icon cursor" v-if="isPush" @click="startPush">
            <img src="../assets/image/webrtc_push.png">
          </p>
          <p class="setting-icon cursor" v-else @click="stopPush">
            <img src="../assets/image/webrtc_pusher_stop.png">
          </p>
        </div>
        <!--                <div >-->
        <!--                    <p class="setting-icon cursor" v-if="isPlay" @click="playHandler">-->
        <!--                        <img src="../assets/image/unplay.png">-->
        <!--                    </p>-->
        <!--                    <p class="setting-icon cursor" v-else @click="playHandler">-->
        <!--                        <img src="../assets/image/play.png">-->
        <!--                    </p>-->
        <!--                </div>-->
      </div>
    </div>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import Vue from 'vue'
  export default {
    name: 'pusher',
    data() {
      return {
        pusherTime: '00:00:00',
        ready: false,
        go: false,
        drawer: true,
        direction: 'rtl',
        isPush: true,
        playUrl: {
          flv: '',
          cdnUrl: '',
        },
        pushContent: '开始直播',
        urLinput: 'test',
        isMute: false,
        isStartCamera: true,
        isPlay: true,
        isShow_playUrl: false,
        timer_record: null,
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
    created() {

    },
    mounted() {
      // 初始化监听器
      this.initListener()

      // this.logout()
      window.addEventListener('beforeunload', () => {
          this.logout()
        }
      )

    },

    watch: {},

    methods: {
      handleClose() {
        this.drawer = !this.drawer
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
        console.log(this.chatInfo)
        let userID = this.chatInfo.userId
        let userSig = this.chatInfo.userSig
        let SDKAppID = this.chatInfo.sdkAppID
        let liveDomainName = '3891.liveplay.myqcloud.com'
        let streamID = this.chatInfo.streamId

        if (!streamID) {
          streamID = `${SDKAppID}_${this.chatInfo.groupId}_${userID}_main` //sdkappid_roomid_userid_main
        }
        let url = `room://livedomainname=${liveDomainName}&sdkappid=${SDKAppID}&roomid=${this.chatInfo.groupId}&userid=${this.chatInfo.userId}&usersig=${userSig}&streamid=${streamID}`
        this.ready = true
        this.startAnimation()
        this.pusher.startPush(url).then(() => {
          console.log('demo pusher | startPush | ok')
          this.timeRecord()
          this.isPush = false
          this.isShow_playUrl = true
          this.getLiveStreamURL()
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
          clearInterval(this.timer_record)
          this.pushContent = '开始直播'

        }).catch((error) => {
          console.error('demo pusher | stopPush | failed', error)
        })
      },
      // 获取推流地址
      getLiveStreamURL() {
        let url = this.pusher.getLiveStreamURL()
        this.playUrl.flv = url
        // +'&roomid='+this.chatInfo.groupId
        // https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive-demo-preview/index.html
        this.playUrl.cdnUrl = '        https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblivedemo/0.3.2/index.html?flv=' + url

        console.log('demo pusher | getLiveStreamURL | ' + url, ' cdn 观看：https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive-preview/index.html?flv=' + url)
      },
      playHandler() {
        this.isPlay = false
        // window.location.href = this.playUrl.cdnUrl
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
</script>

<style scoped lang="stylus">
  .cursor {
    cursor: pointer;
  }

  .pusher-text {
    color: #6a6a6a;
    font-size: 12px;
    padding 0 20px
  }

  .active {
    color: #2d8cf0
  }

  .setting-icon {
    width 50px
    display flex
    flex-direction column
    justify-content center
    align-items center
  }

  .pusher-Mobile {
    position relative
    height 100%

    .video-container {
      position relative
      height 100%
      display flex
      flex-direction column
      justify-content center
      align-items center

      .stop-camera {
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        background-color #ffffff
        display flex
        flex-direction column
        justify-content center
        align-items center
      }

      .live-btn {
        position absolute
        top 20px
        right 0
        left 0
        margin auto
        z-index 9998
        line-height 38px
        width 100px
        border-radius 20px
        text-align center
        font-size 14px
        cursor pointer
        color #fff

      }

      .push-btn {
        background #2d8cf0
      }

      .unpush-btn {
        background #2d8cf0
      }

    }

    .ready-go {
      position: absolute;
      top 0
      bottom: 0
      right 0
      left 0
      color #ffffff
      font-size 32px
      display flex
      justify-content center
      align-items center
      flex-direction column

      .ready-box {
        width 130px
        height 130px
        border-radius 50%
        background rgba(0, 0, 0, 0.35)
        text-align center
        line-height 130px
      }
    }

    .login-container {
      display flex
      justify-content center
      align-items center
      flex-direction column
      //padding-top: 100px;
    }

    .chat-container {
      position relative
      width 360px
      background #ffffff
      color #ffffff
      margin-left 10px
      border-radius 5px 5px 0 0
    }

    .room-time {
      position fixed
      margin auto
      right 60px
      left 10px
      top 10px
      display flex
      justify-content space-between

      & div {
        padding 2px 5px
        border-radius 18px
        background rgba(0, 0, 0, 0.38)
      }

      .room-img {
        height 21px
        margin-right 5px
      }

      .time-img {
        height 28px
        padding-right 3px
      }

      .room-text {
        font-size 14px
        color #ffffff
        line-height 28px
        vertical-align middle
        margin-right 3px
      }

    }

    .start-btn {
      position fixed
      margin auto
      right 0
      left 0
      width 60%
      bottom 50px
      padding 15px 30px
      border-radius 30px
      font-weight 500
      background-color #f5a623
      text-align center
      font-size 16px
      color #ffffff
      letter-spacing 1px
      z-index 222
    }

    .setting-bar {
      position: absolute;
      //width: $width;
      width 45%
      height 80px
      bottom 30px
      right 0

      .video-bar {
        position fixed
        right 10px
        bottom 100px
        justify-content center
        transition: all .5s
        z-index 9998
        display inline-flex
        flex-direction column

        & img {
          width 35px
          /*height 42px*/
          margin-bottom 7px
        }

        .push-icon {

        }
      }


    }
  }

  .play-url {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  //手机二维码
  .el-dialog__wrapper {
    display flex
    justify-content center
    align-items center
  }

  /deep/ .el-dialog--center {
    margin 0 !important
    width 360px !important
    padding 5px 0
  }

  /deep/ .el-dialog__title {
    color #1A8CFF
    font-size 16px
  }

  .mobile-Live {
    display block
    margin 0 auto
    /*width 60px*/
    /*height 60px*/
  }

  /deep/ .el-dialog--center .el-dialog__body {
    padding: 0px 25px 25px;
  }

  //修改视频样式
  /deep/ .vcp-player video {
    /*background-color #141520*/
    position absolute
    top 0
    left 0
    width 100%
    height 100%
  }

  /deep/ .vcp-player {
    width 100%
    height 100%
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /deep/ .vcp-bigplay {
    display none
  }

  /deep/ .vcp-error-tips {
    color #FFFFFF
    margin-top: -8.25em
  }

  /*抽屉*/
  /deep/ .el-drawer__wrapper {
    position relative //  absolute  drawer 浮在上边
    min-width 360px
    height 100%
    right 0
    left auto
  }

  /deep/ .el-drawer {
    width 100% !important
  }

  /deep/ .el-popover {
    position: absolute;
    background: #FFF;
    min-width: 150px;
    border-radius: 4px;
    border: none
    padding: 12px
    z-index: 2000;
    color: #2d8cf0
    line-height: 1.4
    text-align: justify
    font-size: 14px
  }

  /*input     */
  .el-input /deep/ {
    width 60%
    /*border-radius 50%*/
    border-bottom 2px solid #2d8cf0
    outline none
    /*margin-left 20px*/
  }

  .el-input /deep/ .el-input__inner {
    /*color #ffffff*/
    // background linear-gradient(90deg,#32374d,#262b44);
    /*border-radius 50%*/
    border none
    outline none
    height 32px
    line-height 32px
    border-radius 0px
  }

  .el-divider--horizontal {
    margin 6px auto 0
    width 90%
  }


</style>
