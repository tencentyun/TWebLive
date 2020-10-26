<template>
    <div class="chat-wrapper">
        <div class="live-title">
             <span v-for="(item,index) in tabs" :key="index" class="title-item" :class="{active:isActive[index]}"
            @click="tabClick(index)">{{item}}</span>
        </div>
        <div >
            <Tips></Tips>
        </div>
        <div id="message-send-box-wrapper" v-show="this.tabSelected ===0">
            <div class="message-list" ref="message-list" @scroll="this.onScroll">
                <div class="message-box" v-for="message in currentMessageList" :key="message.ID" :message="message">
                    <img v-if="textMsg(message.type)" class="message-img" :src="message.avatar"
                         @error="imgError(message)">
                    <div class="message-item" v-if="textMsg(message.type)">
                        <div style="display: flex;margin-bottom: 6px">
                            <p class="message-nick">{{message.nick}}</p>
                            <span class="message-date">{{getDate(message)}}</span>
                        </div>
                        <div class="message-container">
                            <div class="triangle"></div>
                            <template v-for="(item, index) in contentList(message.payload.text)">
                                <span :key="index" class="message-text"
                                      v-if="item.name === 'text'">{{ item.text }}</span>
                                <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px"
                                     :key="index"/>
                            </template>
                            <MessageStatusIcon v-if="message.status==='fail'" :message="message"></MessageStatusIcon>
                        </div>

                    </div>
                    <div class="tip-leave" v-if="leaveMsg(message.type)"
                    >
                        <span>{{getGroupTipContent(message)}}</span>
                    </div>

                </div>
            </div>
            <div class="send-header-bar">
                <el-popover placement="top" width="400" trigger="click">
                    <div class="emojis">
                        <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
                            <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px"/>
                        </div>
                    </div>
                    <i class="iconfont icon-smile" slot="reference" title="发表情"></i>
                </el-popover>
                <div class="login-btn" v-if="!isSDKReady && playType==='cdn'">
                    游客状态请先<a @click="checkLogin" style="color:#409eff; cursor:pointer;margin-left: 2px">登录</a>
                </div>
                <div v-else>
                    <el-input
                            type="textarea"
                            placeholder="发个弹幕呗~"
                            v-model="messageContent"
                            @focus="focus = true"
                            @blur="focus = false"
                            @keyup.enter.native="handleEnter"
                            @keyup.ctrl.enter.prevent.exact="handleLine"
                    >
                    </el-input>
                    <div class="send-btn">
                        <el-button type="primary" @click="sendTextMessage" round>发送</el-button>
                    </div>
                </div>

                <liveLike>
                    <template slot-scope="{sendCustomMessage}">
                        <canvas id="bubble" class="canvas-box"></canvas>
                        <img class="like-img cursor" @click="sendCustomMessage()" src="../../assets/image/like-0.png"/>
                    </template>
                </liveLike>
            </div>
        </div>
        <div class="tab-summary" v-show="this.tabSelected ===1">
            <p class="summary-text">TWebLive 集成了腾讯云实时音视频 TRTC、腾讯云即时通信 IM 、腾讯云超级播放器 TCPlayer ，覆盖了 Web 直播互动场景常见的功能（推流、开/关麦，开/关摄像头，微信分享观看、聊天点赞等等），并封装了简单易用的 API 。您可以通过接入 TWebLive 快速实现 Web 端推流、拉流以及实时聊天互动功能。</p>
            <p class="summary-text">欢迎在github提issue哦~</p>
            <p class="github-text" style="font-size: 15px;cursor: pointer" @click="githubHandler">https://github.com/tencentyun/TWebLive</p>
        </div>
    </div>
</template>

<script>
  import { mixinChat } from './chat.js'

  export default {
    mixins: [mixinChat],
    name: 'newChatPlayer',
    data() {
      return {
        isActive: [1, ''],
        tabs: ['互动', '介绍'],
        tabSelected: 0,  //互动
      }
    },
  }
</script>

<style lang="stylus" scoped>


    .cursor {
        cursor: pointer;
    }

    .canvas-box {
        bottom 160px
    }

    //tab样式
    .live-title {
        display flex
        justify-content center
        height 40px
        line-height 40px
        color #8A9099
        text-align center
        margin 0 auto
        opacity: 0.35
        border-bottom 0.5px solid #8A9099
        font-size 16px
    }

    .active {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        border-bottom 2px solid #ffffff;
        color: #ffffff;
        letter-spacing: 0;
    }

    .title-item {
        display block
        width: 50%

    }

    .summary-text, .github-text {
        padding 5px 15px
        line-height 25px
        text-align left
        color #ffffff
    }
    .github-text:hover{
        145
        color #409eff
        146
    }

    #message-send-box-wrapper {
        /*height 100%*/
        /*position relative*/
        box-sizing border-box
        overflow hidden
        /*padding: 3px 20px 20px 20px*/
    }

    .message-list {
        position absolute
        z-index 1
        width 100%
        top 70px
        bottom 155px
        overflow auto
        overflow-x hidden
        box-sizing border-box
        overflow-y scroll
        -webkit-overflow-scrolling touch //ios卡顿
        padding 8px 20px
        margin-bottom 5px
    }

    .emojis {
        height 160px
        box-sizing border-box
        display flex
        flex-direction row
        flex-wrap wrap
        overflow-y scroll
    }

    .chat-wrapper {
        /*position: relative;*/
        box-sizing border-box
        padding-top 30px
        //width: $width;
        width 100%
        height 100%
        /*max-width 400px*/
        box-shadow 0 11px 20px 0 rgba(0, 0, 0, 0.3)

        .official-link {
            display flex
            text-decoration none
            color #38c9ff
            width fit-content
            float right
            height 45px
            align-items center
        }
    }

    .login-btn {
        position absolute
        bottom 5px
        /*width 100%*/
        padding 5px 15px
        color #ffffff
        text-align center
        background rgba(138,144,153,.3)
        /*border-radius 50%*/
        border none
        outline none
        /*height 38px*/
        font-size 15px
        line-height 32px
        border-radius 15px
    }

    .message-box {
        color #FFFFFF
        display flex

        .message-item {
            font-size 14px
            padding 4px 8px
            position relative
            line-height 18px
            word-wrap break-word
            white-space normal
            width 90%
            margin-left 6px

            .message-nick, .message-date {
                font-size 12px
                line-height: 23px
                color rgba(254, 255, 254, 0.5)
            }

            .message-date {
                margin-left 5px
            }

            .message-container {
                display inline-block
                position relative
                background-color #737882
                border-radius 3px
                padding 5px 12px 5px 10px

                .triangle {
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 6px solid #737882;
                    position: absolute;
                    left: 8px;
                    top: -6px;
                }

            }

        }

        .tip-text, .tip-leave {
            width 100%
            text-align center
            font-size 12px
            position relative
            line-height 18px
            word-wrap break-word
            white-space normal
            /*margin 0 auto*/
            color #3766B6 //#258ff3//#fea602

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
            font-size 12px
            color #F0F5FF
            line-height 18px
            white-space normal
            word-break break-all
            word-wrap break-word
        }
    }

    .message-img {
        display inline-block
        min-width 40px
        max-width 40px
        height 40px
        border-radius 50%
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
    }

    .send-header-bar {
        width 100%
        position absolute
        bottom 10px
        display flex
        height 150px
        border-top 0.5px solid #8A9099;
        justify-content center
        box-sizing border-box
        /*padding 3px 0 0 0*/
        padding: 3px 20px 5px 20px

    }

    .send-header-bar span {
        display flex
        justify-content center
        align-items center
        line-height: 24px
    }

    .send-header-bar i {
        position absolute
        left 10px
        top 10px
        cursor pointer
        font-size 20px
        color #8A9099
        line-height 24px
        margin 0 12px 0 0
    }

    .send-header-bar i:hover {
        color #FFFFFF
    }
    .like-img {
        /*position absolute*/
        /*left 50px*/
        display block
        width 20px
        height 20px
        position absolute
        left 45px
        top  10px
        cursor pointer
    }
    .el-input /deep/ {
        width 60%
        /*border-radius 50%*/
        border none
        outline none
    }
    .el-textarea /deep/{
        width 90%
        height 80px
        position absolute
        left 10px
        top 40px

    }
    .el-textarea /deep/ .el-textarea__inner {
        resize none
        color #ffffff
        background #34363b
        /*border-radius 50%*/
        border none
        outline none
        height 100%
        line-height 38px
        border-radius 20px
    }

    .send-btn {
        position absolute
        bottom 10px
        right 10px
        display flex
        padding 0 0 0 12px
    }

    .el-button--primary /deep/ {
        background: rgba(138,144,153,0.30);
        border-color #34363b //#F5A623
        padding 10px 30px

    }

    textarea {
        resize none
    }
</style>
