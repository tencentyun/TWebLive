<template>
  <div class="pusher-Mobile">
    <div id="video-container" class="video-container"></div>
    <pusher-setting v-show="show_creat && isPush"></pusher-setting>
    <div class="disabled-box" v-show="show_creat && isPush" @click="disabledHandler"></div>
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
    <div>
      <div class="start-btn" v-show="show_creat && isPush" @click="creatLiveRoom">开始直播</div>
      <div class="room-time" v-if="!isPush">
        <div>
          <img class="room-img" :src="userInfo.avatar" @error="imgError(userInfo)"/>
          <span class="room-text">{{title}}</span>
        </div>
<!--        <div style="width: 93px">-->
<!--          <img class="time-img" v-if="isPush" src="../../assets/image/time-mobile.png">-->
<!--          <img class="time-img" v-else src="../../assets/image/pushing.png">-->
<!--          <span class="room-text">{{pusherTime}}</span>-->
<!--        </div>-->
      </div>
      <div class="pusher-bar">
        <img class="pusher-icon cursor"  @click="playHandler" src="../../assets/image/live-share.png">
        <img class="pusher-icon cursor" @click="show_more =!show_more" src="../../assets/image/pusher-more.png">
        <div>
          <img class="pusher-icon cursor" v-if="isPush"   @click="startPush" src="../../assets/image/pusher-start.png">
          <img class="pusher-icon cursor" v-else @click="openConfirm"  src="../../assets/image/pusher-stop.png">
        </div>
      </div>


      <div class="setting-bar">
        <div class="video-bar" v-show="show_more">
          <div>
            <!--                    打开麦克风-->
            <p class="setting-icon cursor" v-if="isMute" @click="startMicrophone">
              <img src="../../assets/image/close-mic.png">
            </p>
            <p class="setting-icon cursor" v-else @click="stopMicrophone">
              <img src="../../assets/image/open-mic.png">
            </p>
          </div>

          <div>
            <p class="setting-icon cursor" v-if="isStartCamera" @click="startCamera">
              <img src="../../assets/image/close-camera.png">
            </p>
            <p class="setting-icon cursor" v-else @click="stopCamera">
              <img src="../../assets/image/open-camera.png">
            </p>
          </div>
        </div>
      </div>
      <el-dialog
              title="微信扫码观看"
              :visible.sync="isShow_playUrl"
              width="30%"
              center>
        <QRCode class="mobile-Live" :url="playUrl.cdnUrl"/>
      </el-dialog>
    </div>
    <div v-if="isTest">
      <CapabilityTest :isTest="isTest"></CapabilityTest>
    </div>
  </div>

</template>

<script>
  import { mixinPusher } from './pusher.js'
  import QRCode from '../qrcode'
  import pusherSetting from './components/pusherSetting'
  import CapabilityTest from '../test/test'

  export default {
    mixins:[mixinPusher],
    name: 'pusher',
    components: {
      QRCode,
      pusherSetting,
      CapabilityTest
    },
    data() {
      return {
        isTest:false,
        ready: false,
        go: false,
        show_more:false
      }
    },
    methods: {
      disabledHandler() {
        this.$store.commit('showMessage', { message: '请先创建直播间哦~', type: 'warning' })
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
  .pusher-icon {
    display block
    width: 35px;
    height: 35px;
    margin-left 10px
    /*border-radius: 50%;*/
  }
  .pusher-Mobile {
    position relative
    height 100%
  .disabled-box {
    position fixed
    height 50px
    bottom 0
    left 0
    right 100px
    z-index 223
  }
    .video-container {
      position relative
      height 100%
      display flex
      flex-direction column
      justify-content center
      align-items center
      & div{
        background-color rgba(0,0,0,0) !important
      }
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
        padding 4px
        border-radius 25px
        background rgba(0, 0, 0, 0.6)
      }

      .room-img {
        height 36px
        width 36px
        border-radius 50%
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
        margin-right 8px
      }

    }

    .start-btn {
      position fixed
      margin auto
      right 0
      left 0
      width 60%
      bottom 60px
      padding 15px 30px
      border-radius 30px
      font-weight 500
      background-color #2864F0
      text-align center
      font-size 16px
      color #ffffff
      letter-spacing 1px
      z-index 222
    }

    .pusher-bar {
      position fixed
      margin auto
      right 10px
      width 140px
      bottom 10px
      z-index 222
      display flex
      //background-color rgba(0,0,0,0.55)

    }
    .setting-bar {
      position: absolute;
      //width: $width;
      width 45%
      height 80px
      bottom 30px
      right 0

      .video-bar {
        width 42px
        height 105px
        background-color rgba(0,0,0,0.4)
        position fixed
        right 57px
        bottom 55px
        justify-content center
        transition: all .5s
        z-index 2000
        display inline-flex
        flex-direction column
        border-radius 6px
        & img {
          width 32px
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
    width 280px !important
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
    height 100% !important
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
    width 80%
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

  /deep/ .el-divider--vertical {
    margin 0
    width 90%
  }
  /deep/ .el-divider {
    background-color rgba(255,255,255,0.2)

  }



</style>
