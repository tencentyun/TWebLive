<template>
  <div class="player">
    <div id="player-container" class="video-container">
      <div style="position: absolute">
        <img src=".././../assets/image/no-video.png">
        <p style="font-size: 24px;color: #8A9099;text-align: center;margin-top: 30px"> 暂无画面</p>
      </div>
    </div>
    <div class="setting-bar" v-if="playType !=='cdn'">
      <div class="player-time">
<!--        <p>{{playerTime}}</p>-->
      </div>
      <div>
        <div class="player-start cursor" v-if="!isPlay" @click="resumeVideo">
          <img class="player-icon" src="../../assets/image/pusher-start.png">
          <span class="play-text">观看直播</span>
        </div>
        <div class="player-start cursor" v-else @click="pauseVideo">
          <img class="player-icon" src="../../assets/image/pusher-stop.png">
          <span class="play-text">停止观看</span>
        </div>
      </div>
      <div class="volume-box" @mouseover="showSetVolume=true" @mouseout="setPlayoutVolume">
        <p class="setting-icon cursor " @click="setPlayoutVolume">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1" fill="white">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.18171 12H0V4H4.19181L8 0.831913L9 0V1.3008V14.7003V16L8 15.1698L4.18171 12ZM5 4.62845L8 2.13271V13.8701L5 11.3796V4.62845Z"/>
            </mask>
            <path d="M0 12V14H-2V12H0ZM4.18171 12V10H4.9037L5.45921 10.4612L4.18171 12ZM0 4H-2V2H0V4ZM4.19181 4L5.47089 5.53752L4.91496 6H4.19181V4ZM8 0.831913L6.72092 -0.705603V-0.705603L8 0.831913ZM9 0L7.72092 -1.53752L11 -4.26543V0H9ZM9 16H11V20.2597L7.72251 17.5388L9 16ZM8 15.1698L9.27749 13.631H9.27749L8 15.1698ZM5 4.62845H3V3.69068L3.72092 3.09094L5 4.62845ZM8 2.13271L6.72092 0.595197L10 -2.13271V2.13271H8ZM8 13.8701H10V18.1299L6.72251 15.409L8 13.8701ZM5 11.3796L3.72251 12.9185L3 12.3187V11.3796H5ZM0 10H4.18171V14H0V10ZM2 4V12H-2V4H2ZM4.19181 6H0V2H4.19181V6ZM2.91273 2.46248L6.72092 -0.705603L9.27908 2.36943L5.47089 5.53752L2.91273 2.46248ZM6.72092 -0.705603L7.72092 -1.53752L10.2791 1.53752L9.27908 2.36943L6.72092 -0.705603ZM11 0V1.3008H7V0H11ZM11 1.3008V14.7003H7V1.3008H11ZM11 14.7003V16H7V14.7003H11ZM7.72251 17.5388L6.72251 16.7087L9.27749 13.631L10.2775 14.4612L7.72251 17.5388ZM6.72251 16.7087L2.90422 13.5388L5.45921 10.4612L9.27749 13.631L6.72251 16.7087ZM3.72092 3.09094L6.72092 0.595197L9.27908 3.67023L6.27908 6.16597L3.72092 3.09094ZM10 2.13271V13.8701H6V2.13271H10ZM6.72251 15.409L3.72251 12.9185L6.27749 9.8408L9.27749 12.3313L6.72251 15.409ZM3 11.3796V4.62845H7V11.3796H3Z" fill="#8A9099" mask="url(#path-1-inside-1)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6088 13.9991C13.9991 13.0388 15.6868 10.6992 15.6868 7.9654C15.6868 5.24314 14.0133 2.91174 11.639 1.94385L10.9332 3.81684C12.5511 4.49874 13.6868 6.09944 13.6868 7.9654C13.6868 9.84413 12.5355 11.454 10.8999 12.1278L11.6088 13.9991Z" fill="#8A9099"/>
          </svg>
          <span class="mic-text">声音</span>

        </p>
        <span class="progress-box" v-show="showSetVolume">
              <el-slider vertical height="200px" @change="setPlayoutVolume" v-model="volumeValue"></el-slider>
        </span>
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
  .active {
    color: #2d8cf0
  }

  .setting-icon {
    display flex
    justify-content center
    align-items center
    height 40px
    margin 0 8px
  }
  .player {
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
    }
    .setting-bar {
      background-color #121214
      position: absolute;
      bottom 0
      width 100%
      height 55px
      .player-time{
        position: absolute;
        bottom 0
        left 15px
        width 100%
        line-height 60px
        font-size: 14px;
        color: #D2DAE6;
        letter-spacing: 0;
      }
      .player-start {
        position: absolute;
        right 0
        bottom 0
        width 210px
        height 55px
        background #3766B6
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .player-mic{
        position: absolute;
        right 260px
        bottom 0
        /*width 210px*/
        height 55px
        display: flex;
        justify-content: center;
        align-items: center
        padding 0 10px
      }
      .play-text{
        font-size 16px
        color #ffffff
        margin-left 5px
      }
      .player-icon{
        width 14px
        height 14px
      }
      .mic-text{
        font-size 14px
        color #8A9099
        margin-left 5px
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
    width 100% !important
    height 100% !important
    object-fit cover
  }

  /deep/ .vcp-player {
    width 100% !important
    height 100% !important
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:rgba(0,0,0,0)
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
  .progress-box {
    /*background #6a6a6a*/
    /*display flex*/
    /*justify-content center*/
    /*align-items center*/
    padding 4px 0
    position absolute
    bottom 35px
    right 32px
  }
  /deep/ .el-slider__button{
    width 12px
    height 12px
    border: none
  }
  /deep/ .el-slider__bar {
    background-color rgb(55, 102, 182)
  }

  .volume-box {
    /*height 120px*/
    /*width 20px*/
    position absolute
    right 215px
    bottom 5px

  }
</style>

