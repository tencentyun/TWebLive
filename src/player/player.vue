<template>
  <div class="player">
    <div id="player-container" class="player-container">
      <!--            <div class="stop-camera" v-if="isStartCamera">-->
      <!--               <img src="../assets/image/camera-max.png"/>-->
      <!--               <p class="player-text" style="margin-top: 20px">摄像头未打开哦~</p>-->
      <!--            </div>-->
    </div>
    <div class="video-bar">
      <div>
        <!--                静音播放器-->
        <el-tooltip class="item" effect="dark" :content="audioContent" placement="top">
          <p class="setting-icon cursor" v-if="!isMute" @click="pauseAudio">
            <img src="../assets/image/open-microphone.png">
          </p>
          <p class="setting-icon cursor" v-else @click="resumeAudio">
            <img src="../assets/image/mute.png">
          </p>
        </el-tooltip>


      </div>

      <div>
        <el-tooltip class="item" effect="dark" :content="playContent" placement="top">

          <p class="setting-icon cursor player-icon" v-if="!isPlay" @click="resumeVideo">
            <img src="../assets/image/player.png">
          </p>
          <p class="setting-icon cursor pause-icon" v-else @click="pauseVideo">
            <img style="height: 20px;width: 20px" src="../assets/image/stop-player.png">
          </p>
        </el-tooltip>

      </div>
      <div class="volume-box" @mouseover="showSetVolume=true">
        <p class="setting-icon cursor volume-icon" @click="setPlayoutVolume">
          <img class="volume-img" src="../assets/image/volume.png">
        </p>
        <span class="progress-box" v-show="showSetVolume" @mouseleave="showSetVolume=false">
                        <el-slider vertical height="200px" @change="setPlayoutVolume" v-model="volumeValue"></el-slider>
          <!--                    <el-progress :percentage="80" :show-text="false"></el-progress>-->
                </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Vue from 'vue'
  export default {
    name: 'player',
    data() {
      return {
        drawer: true,
        volumeValue: 70,
        showSetVolume: false,
        direction: 'rtl',
        isPush: true,
        playUrl: {
          flv: '',
          cdnUrl: '',
        },
        audioContent: '关闭麦克风',
        urLinput: 'test',
        isMute: false,
        playContent: '暂停',
        isStartCamera: true,
        isPlay: true,
        isShow_playUrl: false,
        islowlatency: true,
        playUrl_flv: 'https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv',
        playUrl_m3u8: 'https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.m3u8'
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
      // this.logout()
      this.initListener()

    },
    destroyed() {
      this.stopPlay()
    },
    methods: {
      initListener() {
        const player = Vue.prototype.TWebLive.createPlayer()
        window.player = player
        Vue.prototype.player = player
        this.setRenderView()
        // 播放时
        this.player.on(this.TWebLive.EVENT.PLAYER_PAUSE, this.onPlayerPlaying)
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
        // var url = 'https://'
        //   + 'flv=https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv' + '&' // 请替换成实际可用的播放地址
        //   + 'hls=https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.m3u8'; // 请替换成实际可用的播放地址
        // 播放 WebRTC 低延时流，填入 sdkappid roomid 等信息，此时 url 必须以 `room://` 开头
        let userID = this.chatInfo.userId
        let userSig = this.chatInfo.userSig
        let SDKAppID = this.chatInfo.sdkAppID
        let roomID = this.chatInfo.groupId
        let url = `room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`

        this.player.startPlay(url).then(() => {
          console.log('demo player | startPlay | ok')
          this.isPlay = true
          this.isShow_playUrl = true
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
        console.log('demo player | setPlayoutVolume', this.volumeValue)
        this.player.setPlayoutVolume(this.volumeValue)
      },
      // 停止播放
      stopPlay() {
        this.player.stopPlay()
        console.log('demo player | stopPlay | ok')
        this.isPlay = false
        this.pushContent = '开始直播'
      },
      // 获取推流地址
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

  .progress-box {
    background #6a6a6a
    /*display flex*/
    /*justify-content center*/
    /*align-items center*/
    padding 4px 0
    position absolute
    bottom 50px
    right 14px
  }

  .volume-box {
    /*height 120px*/
    /*width 20px*/
    position absolute
    right 5px
    bottom 5px

  }

  .player-text {
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
    width 40px
    height 40px
    margin 0 8px
  }

  .player {
    position relative
    height 100%
    background url("../../src/assets/image/video-bg.png") no-repeat center //#8a808005
    background-size 100%
    background-color #000
    /*padding-top 30px*/

    .player-container {
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

    .video-bar {
      position absolute
      left 0
      bottom 0
      padding: 10px 40px
      display flex
      justify-content center
      transition: all .5s
      right 0
      z-index 999
      background rgba(0, 0, 0, 0.36)

      & img {
        width 40px
        height 40px
        display block
        /*height 42px*/
      }

      .volume-icon {
        width 40px
        height 40px
        border-radius 50%
        background rgba(0, 0, 0, 0.3)

        .volume-img {
          display block
          width 25px
          height 25px
        }
      }


      .push-icon {

      }
    }

    .chat-container {
      position relative
      width 360px
      background #ffffff
      color #ffffff
      margin-left 10px
      border-radius 5px 5px 0 0
    }

  }

  .play-url {
    width: 60%;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-icon, .pause-icon {
    width 40px
    height 40px
    border-radius 50%
    background #ffffff

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

  /deep/ .el-slider.is-vertical .el-slider__runway {
    margin 3px 10px
  }

  @media screen  and (max-width: 1000px) {
    .container-pc {
      overflow-x auto
    }
  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    .live-pc {
      width 100%
    }
  }

  @media screen and (min-width: 1500px) {
    .live-pc {
      width 80%
    }
  }

</style>
