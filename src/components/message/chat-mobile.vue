<template>
    <div class="chat-wrapper">
        <div class="swiper-container">
            <liveLike />
            <div class="message-list" ref="message-list"   @scroll="this.onScroll">
                <div class="message-box"  v-for="message in currentMessageList" :key="message.ID" :message="message">
                    <img v-if="message.type==='TIMTextElem'" class="message-img" :src="message.avatar" @error="imgError(message)">
                    <div class="message-item" v-if="message.type==='TIMTextElem'">
                        <p class="message-nick">{{message.nick}}</p>
                        <div class="message-container">
                            <div class="triangle"></div>
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
                    enter-active-class="animated fadeInRightBig"
                    leave-active-class="animated fadeOut"
            >
                <div v-if="showTip" class="live-tips" :key="showTip.ID">
                    <img v-if="showTip.avatar" :src="showTip.avatar"   class="live-tips-img"/>
                    <span class="live-tips-text">{{getGroupTipContent(showTip)}}</span>
                </div>

            </transition>
        </div>
        <div class="send-header-bar">
            <div class="send-header-box" v-if="!isSDKReady" @click="checkLogin"></div>
            <el-popover  trigger="click">
                <div class="emojis">
                    <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
                        <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px" />
                    </div>
                </div>
                <i class="iconfont icon-smile" slot="reference" title="发表情"></i>
            </el-popover>
            <el-input
                    ref="mobileInput"
                    id="sendInput"
                    placeholder="发个弹幕呗~"
                    v-model="messageContent"
                    @focus="handleMobileInputFocus"
                    @blur="handleMobileInputBlur"
                    @keyup.enter.native="handleEnter"
                    @keyup.ctrl.enter.prevent.exact="handleLine"
            >
            </el-input>
            <div class="send-btn">
                <el-button type="primary" @click="sendTextMessage"  round>发送</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  import { decodeText } from '../../utils/decodeText'
  import { mapState } from 'vuex'
  import {
    Input,
    Popover,
  } from 'element-ui'
  import liveLike from './liveLike/liveLike1.vue'
  import MessageStatusIcon from './message-status-icon.vue'
  import { emojiMap, emojiName, emojiUrl } from '../../utils/emojiMap'
  export default {
    name: 'newChat',
    props: ['scrollMessageListToButtom'],
    components: {
      ElInput: Input,
      ElPopover: Popover,
      liveLike: liveLike,
      MessageStatusIcon:MessageStatusIcon
    },
    data() {
      return {
        isShow: true,
        isShowScrollButtomTips: false,
        tips:[],
        preScrollHeight: 0,
        messageContent: '',
        isSendCustomMessage: false,
        sendCustomDialogVisible: false,
        surveyDialogVisible: false,
        form: {
          data: '',
          description: '',
          extension: ''
        },
        rate: 5, // 评分
        suggestion: '', // 建议
        file: '',
        emojiMap: emojiMap,
        emojiName: emojiName,
        emojiUrl: emojiUrl,
        showAtGroupMember: false,
        atUserID: '',
        focus: false,
      }
    },
    computed: {
      ...mapState({
        isSDKReady: state => state.user.isSDKReady,
        isLogin: state => state.user.isLogin,
        userInfo: state => state.user.userInfo,
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        currentLiveTips:state => state.conversation.currentLiveTips,
        userID: state => state.user.userID
      }),
      contentList() {
        return (text) => {
          return decodeText(text)
        }

      },
      showTip () {
        if(this.currentLiveTips.length > 0) {
          return this.currentLiveTips[0]
        } else {
          return ''
        }
      },
      getGroupTipContent() {
        return (message) => {
          return message.payload.text
        }
      },
    },
    updated() {
      this.keepMessageListOnButtom()

    },
    mounted() {

    },
    methods: {
      imgError(item) {
        item.avatar = require('../../assets/image/default.png')
      },
      handleMobileInputFocus() {
        window.scroll(0, 400)
        this.focus = true
      },
      handleMobileInputBlur() {

      },
      onScroll({ target: { scrollTop } }) {
        let messageListNode = this.$refs['message-list']
        if (!messageListNode) {
          return
        }
        if (this.preScrollHeight - messageListNode.clientHeight - scrollTop < 20) {
          this.isShowScrollButtomTips = false
        }
      },
      // 如果滚到底部就保持在底部，否则提示是否要滚到底部
      keepMessageListOnButtom() {
        let messageListNode = this.$refs['message-list']
        if (!messageListNode) {
          return
        }
        // 距离底部20px内强制滚到底部,否则提示有新消息
        if (this.preScrollHeight - messageListNode.clientHeight - messageListNode.scrollTop < 20) {
          this.$nextTick(() => {
            messageListNode.scrollTop = messageListNode.scrollHeight + 60
          })
          this.isShowScrollButtomTips = false
        } else {
          this.isShowScrollButtomTips = true
        }
        this.preScrollHeight = messageListNode.scrollHeight
      },
      reEditMessage(payload) {
        this.messageContent = payload
      },
      handleLine() {
        this.messageContent += '\n'
      },
      handleEnter() {
        this.sendTextMessage()
      },
      checkLogin () {
        this.messageContent = ''
        this.$store.commit('showMessage', {
          message: '请先登录',
          type: 'warning'
        })
        this.$store.commit('toggleIsLogin', true)
      },
      sendTextMessage() {
        window.scroll(0, 0)    //ios键盘回落
        if (this.messageContent === '' || this.messageContent.trim().length === 0) {
          this.messageContent = ''
          this.$store.commit('showMessage', {
            message: '不能发送空消息哦！',
            type: 'info'
            })
          return
        }
        let message = {
          payload:{
            text:''
          }
        }
        message.nick = this.userInfo.nickName
        message.avatar = this.userInfo.avatar
        message.payload.text = this.messageContent
        message.type = 'TIMTextElem'
        message.status = 'unsend'
        message.to = this.chatInfo.groupId
        this.$store.commit('pushCurrentMessageList', message)
        this.tweblive.sendTextMessage({
              roomID: this.chatInfo.groupId,
              priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
              text: this.messageContent
            })
              .then(() => {})
              .catch(error => {
                message.status = 'fail'
                //JSON.stringify(error, ['message', 'code'])
                if (error.code ===80001) {
                  error.message = '文本中可能包含敏感词汇'
                }
                this.$store.commit('showMessage', {
                  type: 'error',
                  message: error.message
                })
              })
            this.messageContent = ''
      },
      random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      },
      chooseEmoji(item) {
        this.messageContent += item
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .chat-wrapper {
        position relative
        //width: $width;
        width 100%
        height 100%
        /*max-width: 400px;*/
        box-shadow 0 11px 20px 0 rgba(0, 0, 0, 0.3)
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
        overflow hidden
        z-index 1
        height 100%
    }
    .live-tips {
        position absolute
        top 3px
        right 10px
        background-color #f5a623
        /*padding 0 5px*/
        border-radius 15px
        font-size 12px
        color #ffffff
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
        position absolute
        z-index 1
        width 100%
        top 0
        bottom 55px
        overflow auto
        overflow-x hidden
        box-sizing border-box
        overflow-y scroll
        -webkit-overflow-scrolling touch  //ios卡顿
        padding:5px 20px  //5px 20px 0px 40px
        margin-bottom 55px
    }
    .message-box {
        font-family Microsoft YaHei,Arial,Helvetica,sans-serif,SimSun
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
            margin-left 2px
            .message-nick {
                font-size 12px
                line-height: 23px;
                color #575ba6
            }
            .message-container{
                display inline-block
                position relative
                background-color #32374d
                border-radius 12px
                /*border-top-left-radius:0*/
                padding 8px 11px
                .triangle{
                    width:0;
                    height:0;
                    /*border-top:5px solid transparent;*/
                    border-bottom:10px solid transparent;
                    border-right:10px solid #32374d;
                    border-bottom-right-radius:2px
                    position: absolute;
                    left: -8px;
                    top:6px;
                }

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
        .tip-leave{
            padding 4px 40px
        }
        .message-text{
            font-size 14px
            color #FFFFFF
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
        padding 2px 5%
        bottom 0
        display flex
        justify-content space-between
        box-sizing border-box
        background-color #09090c
    }
    .send-header-bar span  {
        display flex
        justify-content center
        /*align-items center*/
        /*line-height: 24px;*/
    }
    .send-header-bar i {
        cursor pointer
        font-size 28px
        color rgb(245, 166, 35)
        /*line-height 24px*/
        margin 0 12px 0 0
    }

    .send-header-bar i:hover {
        color #FFFFFF
    }
    .el-input /deep/ {
        width 80%
        /*border-radius 50%*/
        border none
        outline none
    }
    .el-input /deep/ .el-input__inner {
        color #ffffff
        background linear-gradient(90deg,#32374d,#262b44)
        /*border-radius 50%*/
        border none
        outline none
        height 32px
        line-height 32px
        border-radius 20px
    }
     .send-btn{
         /*display flex*/
         position relative
         height 32px
         margin-left 10px
         .send-input {
             position absolute
             right 10px
         }
         /*padding: 2px 8px;*/
         .el-input /deep/ .el-input__inner {
             color #ffffff
             background rgba(245, 166, 35,0)
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
