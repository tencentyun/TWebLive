<template>
  <div class="pusher">
    <div id="video-container" class="video-container">
      <div class="stop-camera" v-if="isStartCamera">
        <img src="../assets/image/camera-max.png"/>
        <p class="pusher-text" style="margin-top: 20px">摄像头未打开哦~</p>
      </div>
    </div>
    <div class="setting-bar">
      <div class="url-box">
        <!--                <div style="width: 50%"><span class="setting-text">流名称:</span><el-input v-model="urLinput" placeholder="请输入流名称"></el-input></div>-->
        <div class="play-url" v-if="isShow_playUrl">
          <span class="setting-text" style="min-width: 60px">播放地址:</span>
          <span class="play-text">{{playUrl.flv}}</span>
          <!--                    <img style="height: 22px;margin-left: 5px" src="../assets/image/copy.png"/>-->
        </div>
        <div v-else class="play-url">
          <p style="font-size: 14px">欢迎使用腾讯云直播互动组件哦~</p>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="video-bar">
        <div>
          <!--                    打开麦克风-->
          <p class="setting-icon cursor" v-if="isMute" @click="startMicrophone">
            <img src="../assets/image/close-mcp.png">
            <span class="pusher-text active">打开麦克风</span>
          </p>
          <p class="setting-icon cursor" v-else @click="stopMicrophone">
            <img src="../assets/image/open-microphone.png">
            <span class="pusher-text active">关闭麦克风</span>
          </p>
        </div>

        <div>
          <p class="setting-icon cursor" v-if="isStartCamera" @click="startCamera">
            <img src="../assets/image/close-camera.png">
            <span class="pusher-text">开启摄像头</span>
          </p>
          <p class="setting-icon cursor" v-else @click="stopCamera">
            <img src="../assets/image/open-camera.png">
            <span class="pusher-text active">关闭摄像头</span>
          </p>
        </div>

        <div>
          <p class="setting-icon cursor" v-if="isPush" @click="startPush">
            <img src="../assets/image/webrtc_push.png">
            <span class="pusher-text">开始直播</span>
          </p>
          <p class="setting-icon cursor" v-else @click="stopPush">
            <img src="../assets/image/webrtc_pusher_stop.png">
            <span class="pusher-text active">结束直播</span>
          </p>
        </div>
        <div>
          <p class="setting-icon cursor" v-if="isPlay" @click="playHandler">
            <img src="../assets/image/unplay.png">
            <span class="pusher-text">观看直播</span>
          </p>
          <p class="setting-icon cursor" v-else @click="playHandler">
            <img src="../assets/image/play.png">
            <span class="pusher-text active">观看直播</span>
          </p>
        </div>
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
        setTimeout(() => {
          this.setRenderView()
        }, 1000)
        console.log(this.pusher)
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
        let streamID = this.chatInfo.streamId

        if (!streamID) {
          streamID = `${SDKAppID}_${this.chatInfo.groupId}_${userID}_main` //sdkappid_roomid_userid_main
        }
        let url = `room://livedomainname=${liveDomainName}&sdkappid=${SDKAppID}&roomid=${this.chatInfo.groupId}&userid=${this.chatInfo.userId}&usersig=${userSig}&streamid=${streamID}`
        this.pusher.startPush(url).then(() => {
          console.log('demo pusher | startPush | ok')
          this.isPush = false
          this.isShow_playUrl = true
          this.getLiveStreamURL()
        }).catch((error) => {
          console.error('demo pusher | startPush | failed', error)
        })
      },
      // 停止推流
      stopPush() {
        this.pusher.stopPush().then(() => {
          console.log('demo pusher | stopPush | ok')
          this.isPush = true
          this.pushContent = '开始推流'

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
        this.playUrl.cdnUrl = `https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblivedemo/0.3.2-new-player/index.html?flv=${url}&roomid=${this.chatInfo.groupId}`
        console.log('demo pusher | getLiveStreamURL | ' + url, ' cdn 观看：https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive-preview/index.html?flv=' + url)
      },
      playHandler() {
        this.isPlay = false
        // window.location.href = this.playUrl.cdnUrl
        window.open(this.playUrl.cdnUrl, '_blank')
      }
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
    display flex
    flex-direction column
    justify-content center
    align-items center
  }

  .pusher {
    position relative
    height calc(100% - 200px)
    padding-top 30px

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

    .setting-bar {
      background-color #cdcdcd24
      position: relative;
      border-top: 1px solid #d2dadd
      margin-top 20px
      padding-top 10px
      //width: $width;
      width 100%
      height 120px
      min-width 400px
      box-shadow 0 11px 20px 0 rgba(0, 0, 0, 0.3)

      .url-box {
        display flex
        justify-content center
        padding 0 10px

        .setting-text {
          text-align center
          color: #2d8cf0;
          font-size: 14px;
          padding 0 5px
        }

        .play-text {
          text-align center
          max-width 650px
          overflow hidden
        }

      }

      .video-bar {
        position absolute
        left 0
        bottom 0
        padding: 10px 40px
        display flex
        justify-content center
        transition: all .5s
        right 0
        z-index 9998
        display inline-flex

        & img {
          width 40px
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
