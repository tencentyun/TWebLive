<template>
  <div class="player">
    <div id="player-container" class="player-container">
    </div>
    <div class="video-bar" v-if="playType !== 'cdn'">
      <div>
        <p class="setting-icon cursor" v-if="!isMute" @click="pauseAudio">
          <img src="../../assets/image/open-microphone.png">
        </p>
        <p class="setting-icon cursor" v-else @click="resumeAudio">
          <img src="../../assets/image/mute.png">
        </p>
      </div>

      <div>
        <p class="setting-icon cursor player-icon" v-if="!isPlay" @click="resumeVideo">
          <img src="../../assets/image/player.png">
        </p>
        <p class="setting-icon cursor pause-icon" v-else @click="pauseVideo">
          <img style="height: 20px;width: 20px" src="../../assets/image/stop-player.png">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixinPlayer } from './player.js'
  export default {
    mixins:[mixinPlayer],
    name: 'player',
  }
</script>

<style scoped lang="stylus">
  .cursor {
    cursor: pointer;
  }
  /deep/ .vcp-controls-panel {
    bottom 80px
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
    margin 5px 0
  }

  .player {
    position relative
    height 100%
    background url("../../assets/image/video-bg.png") no-repeat center //#8a808005
    background-size 100%
    /*background-color */
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
      position fixed
      right 20px
      bottom 120px
      display flex
      flex-direction column
      justify-content space-around
      transition: all .5s
      z-index 999

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
  /deep/ .vcp-fullscreen-toggle {
    display none
  }
  /deep/  .vcp-playtoggle {
    width 60px
    background:url("../../assets/image/small-start.png") no-repeat center
    position fixed
    right 0
    top 0
    bottom 0
    left 0
    margin auto
  }
  /deep/ .vcp-playtoggle {

  }
  /deep/ .vcp-fullscreen-toggle {

  }

  /deep/ .vcp-panel-bg {
    opacity 0
  }
  /deep/ .vcp-player video {
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    object-fit cover
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
