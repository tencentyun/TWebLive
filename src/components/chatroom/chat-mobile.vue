<template>
  <div class="chat-wrapper">
    <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
    >
      <div class="swiper-container" v-show="showMessage">
        <div class="message-list" ref="message-list" @scroll="this.onScroll">
          <div class="message-box" v-for="message in currentMessageList" :key="message.ID" :message="message">
            <div class="message-item" v-if="message.type==='TIMTextElem'">
              <img class="message-img" :src="message.avatar" @error="imgError(message)">
              <span class="message-nick">{{message.nick}}:</span>
              <div class="message-container">
                <template v-for="(item, index) in contentList(message.payload.text)">
                  <span :key="index" class="message-text" v-if="item.name === 'text'">{{ item.text }}</span>
                  <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index"/>
                </template>
                <MessageStatusIcon v-if="message.status==='fail'" :message="message"></MessageStatusIcon>
              </div>
            </div>
          </div>
        </div>
        <transition
            name="custom-classes-transition"
            enter-active-class="animated fadeInLeftBig"
            leave-active-class="animated fadeOut"
        >
          <div v-if="showTip" class="live-tips" :key="showTip.ID">
            <img v-if="showTip.avatar" :src="showTip.avatar" class="live-tips-img"/>
            <span class="live-tips-text">{{getGroupTipContent(showTip)}}</span>
          </div>
        </transition>
      </div>
    </transition>
    <div >
      <Tips></Tips>
    </div>
    <div class="send-header-bar">
      <div class="send-box">
        <el-popover trigger="click">
          <div class="emojis">
            <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
              <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px"/>
            </div>
          </div>
          <i class="iconfont icon-smile" slot="reference" title="发表情"></i>
        </el-popover>
        <div class="send-header-box" v-if="!isSDKReady && playType==='cdn'" @click="checkLogin"></div>
        <el-input
                ref="mobileInput"
                id="sendInput"
                placeholder="来说点什么吧~"
                v-model="messageContent"
                @focus="handleMobileInputFocus"
                @blur="handleMobileInputBlur"
                @keyup.enter.native="handleEnter"
                @keyup.ctrl.enter.prevent.exact="handleLine"
        >
        </el-input>
        <p class="send-btn"  @click="sendTextMessage">发送</p>
      </div>

<!--      <img class="send-btn" src="../../assets/image/message.png" @click="showMessage=!showMessage">-->
      <liveLike>
        <template slot-scope="{sendCustomMessage}">
          <canvas id="bubble" class="canvas-box"></canvas>
          <img class="like-img cursor" @click="sendCustomMessage()" src="../../assets/image/like3.png"/>
        </template>
      </liveLike>
    </div>
  </div>
</template>

<script>
  import { mixinChat } from './chat.js'
  export default {
    mixins:[mixinChat],
    name: 'newChat',

  }
</script>

<style lang="stylus" scoped>
  // 点赞组件
  .canvas-box {
    bottom 55px
  }

  .like-img {
    bottom 5px
    right 20px
    width 34px
    height 34px

  }

  .chat-wrapper {
    position relative
    //width: $width;
    width 100%
    height 100%
    /*max-width: 400px;*/

    .chat-title {
      color #ffffff
      text-align center
      line-height 8vh
      width 80%
      margin 0 auto
      border-bottom 2px solid rgb(245, 166, 35)
      /*font-weight: bold;*/
      font-size 16px
    }
  }

  .swiper-container {
    margin 0 auto
    position relative
    /*overflow hidden*/
    z-index 1
    height 100%
    min-height 40px
  }

  .live-tips {
    position absolute
    top -18px
    left 10px
    background-color #f5a623
    /*padding 0 5px*/
    border-radius 15px
    font-size 12px
    color #ffffff
    z-index 999
  }

  .live-tips-img {
    width 25px
    height 25px
    display inline-block
    border-radius 50%
    vertical-align: middle
  }

  .live-tips-text {
    padding: 5px 8px;
    /* line-height: 30px; */
    vertical-align: middle;
    /* height: 30px; */
    display: inline-block;
  }

  .emojis {
    height 160px
    box-sizing border-box
    display flex
    flex-direction row
    flex-wrap wrap
    overflow-y scroll
  }

  .message-list {
    /*position absolute*/
    z-index 1
    width 70%
    max-height 210px
    top 0
    bottom 5px
    overflow auto
    overflow-x hidden
    box-sizing border-box
    overflow-y scroll
    -webkit-overflow-scrolling touch //ios卡顿
    padding: 6px //5px 20px 0px 40px
  }

  .message-box {
    /*font-family Microsoft YaHei,Arial,Helvetica,sans-serif,SimSun*/
    color #FFFFFF
    margin 3px 0

    .message-time {
      .message-date {
        font-size 12px
        color #f5eded
        margin-left 5px
        padding 6px 0
      }
    }

    .message-item {
      display inline-block
      font-size 14px
      padding 2px 8px
      position relative
      line-height 16px
      word-wrap break-word
      white-space normal
      /*width 90%*/
      margin-left 2px
      border-radius 16px
      background rgba(0, 0, 0, 0.66)

      .message-nick {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        line-height: 18px
        color #A3EDFF
        font-weight 500
        padding-left 5px
      }

      .message-container {
        display inline
        position relative
        /*border-top-left-radius:0*/
        padding 3px 6px
      }

    }

    .tip-text, .tip-leave {
      font-size 14px
      position relative
      line-height 18px
      word-wrap break-word
      white-space normal
      /*margin 0 auto*/
      color rgb(245, 166, 35) //#258ff3//#fea602

      .tips-img {
        display inline-block
        width 20px
        vertical-align center
      }

    }

    .tip-text {
      padding 4px 35px
    }

    .tip-leave {
      padding 4px 40px
    }

    .message-text {
      font-size 13px
      color #FFFFFF
      line-height 20px
      white-space normal
      word-break break-all
      word-wrap break-word
    }
  }

  .message-img {
    display inline-block
    min-width 22px
    max-width 22px
    height 22px
    border-radius 50%
    margin-left -6px
  }

  .emoji {
    height 40px
    width 40px
    box-sizing border-box
  }

  .send-header-box {
    z-index 212
    height 42px
    position fixed
    /*margin:0 auto;*/
    width 100%
    bottom 0
    display flex
    justify-content space-between
    box-sizing border-box
  }

  .send-header-bar {
    z-index 211
    height 42px
    position fixed
    /*margin:0 auto;*/
    width 100%
    padding 2px 35px 2px 10px
    bottom 6px
    display flex
    justify-content space-between
    box-sizing border-box
  }
  .send-box {
    display flex
    width calc(100% - 120px)
    border: 1px solid rgba(255,255,255,0.20);
    background: rgba(0,0,0,0.30);
    border-radius: 20px;
  }
  .send-header-bar span {
    display flex
    justify-content center
    /*align-items center*/
    /*line-height: 24px;*/
  }

  .send-header-bar i {
    cursor pointer
    font-size 28px
    color #FFFFFF
    /*line-height 24px*/
    margin 4px 2px 0 4px

  }

  .send-header-bar i:hover {
    color #FFFFFF
  }

  .el-input /deep/ {
    width 70%
    /*border-radius 50%*/
    border none
    outline none
  }

  .el-input /deep/ .el-input__inner {
    color #ffffff
    background rgba(255, 255, 255, 0)
    /*border-radius 50%*/
    border none
    outline none
    height 32px
    line-height 32px
    border-radius 20px
    padding 0 8px
  }

  .send-btn {
    /*display flex*/
    font-size 14px
    position relative
    margin-top 1px
    height 34px
    /*width 20px*/
    padding 0 10px
    line-height 34px
    border-radius 20px
    color #ffffff
    background-color #2864F0
    min-width 32px
    margin-right 1px
    .send-input {
      position absolute
      right 10px
    }

    /*padding: 2px 8px;*/

    .el-input /deep/ .el-input__inner {
      color #ffffff
      background rgba(245, 166, 35, 0)
      /*border-radius 50%*/
      border none
      outline none
      height 32px
      line-height 32px
      border-radius 20px
    }
  }

  .el-button--primary /deep/ {
    background-color rgb(245, 166, 35)
    border-color rgb(245, 166, 35) //#F5A623
    padding 8px 16px;

  }

  /deep/ .el-input__inner::placeholder {
    color: #fff;
    /*text-align:center;*/
  }

  textarea {
    resize none
  }

  .text-input {
    font-size 16px
    width 100%
    box-sizing box-sizing
    border none
    outline none
    background-color transparent
  }

  /* This only changes this particular animation duration */

</style>
