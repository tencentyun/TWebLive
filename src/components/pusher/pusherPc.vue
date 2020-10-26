<template>
  <div class="pusher">
    <div id="video-container" class="video-container">
    </div>
    <div class="setting-bar">
      <div>
        <p class="player-time">{{pusherTime}}</p>
      </div>
      <div>
        <div class="pusher-start cursor" v-if="isPush" @click="startPush">
          <img class="pusher-icon" src="../../assets/image/web-pusher-start.png">
          <span class="play-text">开始直播</span>
        </div>
        <div class="pusher-start cursor" v-else @click="openConfirm">
          <img class="pusher-icon" src="../../assets/image/web-pusher-stop.png">
          <span class="play-text">结束直播</span>
        </div>
      </div>
      <div>
        <div class="pusher-mic cursor" v-if="isMute" @click="startMicrophone">
          <img class="pusher-icon" src="../../assets/image/close-mic.png">
          <span class="mic-text">麦克风</span>
        </div>
        <div class="pusher-mic cursor" v-else @click="stopMicrophone">
          <img class="pusher-icon" src="../../assets/image/open-mic.png">
          <span class="mic-text">麦克风</span>
        </div>
      </div>
      <div>
        <div class="pusher-mic cursor" v-if="isStartCamera" style="right: 340px" @click="startCamera">
          <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>摄像头关闭</title>
            <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="j进度条备份" transform="translate(-751.000000, -22.000000)">
                <g id="编组-9" transform="translate(751.000000, 22.000000)">
                  <g id="编组-11">
                    <path d="M15,7.5 C15,11.6421356 11.6421356,15 7.5,15 C6.57050116,15 5.68049488,14.8309122 4.85906245,14.5218179 L6.43561423,12.8970864 C6.77997642,12.9646116 7.13585551,13 7.5,13 C10.5375661,13 13,10.5375661 13,7.5 C13,7.0789865 12.9526952,6.66902162 12.8631108,6.27513055 L14.4397563,4.65055194 C14.8008626,5.52907797 15,6.49128347 15,7.5 Z M7.5,0 C9.88955323,0 12.0181001,1.11750106 13.3915381,2.85840064 L11.9813778,4.31063973 C10.984196,2.91201268 9.34860401,2 7.5,2 C4.46243388,2 2,4.46243388 2,7.5 C2,9.40763139 2.97118511,11.0884303 4.44609208,12.0749336 L3.03637255,13.5276986 C1.1940301,12.1611583 0,9.97001947 0,7.5 C0,3.35786438 3.35786438,0 7.5,0 Z" id="形状结合" fill="#8A9099" fill-rule="nonzero"></path>
                    <path d="M7.5,5 C8.54350703,5 9.43769004,5.63933214 9.81221332,6.5476607 L6.61637488,9.83935679 C5.67174144,9.48236445 5,8.56962904 5,7.5 C5,6.11928813 6.11928813,5 7.5,5 Z" id="形状结合" fill="#8A9099"></path>
                    <path d="" id="形状结合" stroke="#8A9099" stroke-width="2"></path>
                    <line x1="13.3137085" y1="2" x2="2" y2="13.3137085" id="直线-5" stroke="#8A9099" stroke-width="2" stroke-linecap="square"></line>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <span class="mic-text">摄像头</span>
        </div>
        <div class="pusher-mic cursor" v-else style="right: 340px" @click="stopCamera">
          <img class="pusher-icon" src="../../assets/image/camera-open.png">
          <span class="mic-text">摄像头</span>
        </div>

      </div>
    </div>
    <div v-if="isTest">
      <CapabilityTest :isTest="isTest"></CapabilityTest>
    </div>
  </div>
</template>

<script>
  import { mixinPusher } from './pusher.js'
  import CapabilityTest from '../test/test'
  export default {
    mixins:[mixinPusher],
    name: 'pusher',
    components: {
      CapabilityTest
    },
    data() {
      return {
        isTest:false,
      }
    },
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
    flex-direction column
    justify-content center
    align-items center
  }

  .pusher {
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
      .pusher-start {
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
      .pusher-mic{
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
      .pusher-icon{
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



</style>
