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
            <!--                    <div class="message-time" style="display: flex" v-if="message.type==='TIMTextElem'">-->
            <!--                        <p class="message-nick">{{message.nick}}</p>-->
            <!--                        <span class="message-date">{{getDate(message)}}</span>-->
            <!--                    </div>-->
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
    <div class="send-header-bar">
      <el-popover trigger="click">
        <div class="emojis">
          <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
            <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px"/>
          </div>
        </div>
        <i class="iconfont icon-smile" slot="reference" title="发表情"></i>
      </el-popover>
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
      <img class="send-btn" src="../../assets/image/send1.png" @click="sendTextMessage">
      <img class="send-btn" src="../../assets/image/message.png" @click="showMessage=!showMessage">
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
  import { decodeText } from '../../utils/decodeText'
  import { getFullDate } from '../../utils/date'
  import { mapState } from 'vuex'
  import {
    Input,
    Popover,
  } from 'element-ui'
  import liveLike from '../../components/liveLike/liveLike'
  import MessageStatusIcon from './message-status-icon.vue'
  import { emojiMap, emojiName, emojiUrl } from '../../utils/emojiMap'

  export default {
    name: 'newChat',
    props: ['scrollMessageListToButtom'],
    components: {
      ElInput: Input,
      ElPopover: Popover,
      liveLike: liveLike,
      MessageStatusIcon: MessageStatusIcon
    },
    data() {
      return {
        showMessage: true,
        isShowScrollButtomTips: false,
        tips: [],
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
        currentLiveTips: state => state.conversation.currentLiveTips,
        userID: state => state.conversation.chatInfo.userId
      }),
      contentList() {
        return (text) => {
          return decodeText(text)
        }

      },
      showTip() {
        if (this.currentLiveTips.length > 0) {
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
      getDate() {
        return (message) => {
          return getFullDate(new Date(message.time * 1000))
        }
      },
    },
    updated() {
      this.keepMessageListOnButtom()

    },
    mounted() {
      this.initListener()
    },
    methods: {
      initListener() {
        // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
        this.im.on(this.TWebLive.EVENT.IM_READY, this.onReadyStateUpdate)
        // 被踢出
        this.im.on(this.TWebLive.EVENT.IM_KICKED_OUT, this.onKickedOut)
        // 收到自定义新消息
        this.im.on(this.TWebLive.EVENT.IM_CUSTOM_MESSAGE_RECEIVED, this.onCustomMessageReceived)
        // 收到文本新消息
        this.im.on(this.TWebLive.EVENT.IM_TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
        // 加入直播间
        this.im.on(this.TWebLive.EVENT.IM_REMOTE_USER_JOIN, this.onRemoteUserJoin)
        // 离开直播间
        this.im.on(this.TWebLive.EVENT.IM_REMOTE_USER_LEAVE, this.onRemoteUserLeave)
        // 网络监测
        this.im.on(this.TWebLive.EVENT.IM_NET_STATE_CHANGED, this.onNetStateChanged)
        // 推流结束
      },
      // 没有昵称或者昵称为''或者""的，都用 userID 展示
      canIUseNick(nick) {
        if (nick && nick !== '""' && nick !== '\'\'') {
          return true
        }
        return false
      },
      onTextMessageReceived({ data: messageList }) {
        messageList.forEach((message) => {
          message.nick = this.canIUseNick(message.nick) ? message.nick : message.from
          message.avatar = message.avatar || this.userInfo.defaultImg
        })
        this.$store.commit('pushCurrentMessageList', messageList)
      },
      onCustomMessageReceived({ data: messageList }) {
        this.$store.commit('showLike', messageList.length)
      },
      onRemoteUserJoin({ data: messageList }) {
        messageList.forEach((message) => {
          const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
          message.payload.text = `${userName} 来了`
          // message.type = 'Live-tips'
        })
        this.$store.commit('pushCurrentTipsList', messageList)
      },
      onRemoteUserLeave({ data: messageList }) {
        messageList.forEach((message) => {
          const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
          message.payload.text = `${userName} 走了`
          // message.type = 'Live-tips'
        })
        this.$store.commit('pushCurrentTipsList', messageList)
      },
      onNetStateChanged() {},
      onError({ data }) {
        if (data.message !== '' && data.message !== 'Network Error') {
          // this.$store.commit('showMessage', {
          //   message: data.message,
          //   type: 'error'
          // })
        }
      },
      onReadyStateUpdate({ name }) {
        const isSDKReady = name === this.TWebLive.EVENT.IM_READY ? true : false
        this.$store.commit('toggleIsSDKReady', isSDKReady)

        if (isSDKReady) {
          if (this.chatInfo.role === 'pusher') {
            this.createRoom()
          } else {
            this.enterRoom()
          }
          this.getMyProfile()
        }
      },
      getMyProfile() {
        this.im.getMyProfile().then((res) => {
          this.userInfo.nickName = res.data.nick || this.userID
          this.userInfo.avatar = res.data.avatar || this.userInfo.defaultImg
        }).catch(() => {
        })
      },
      createRoom() {
        let promise = this.im.createRoom({
          name: '我的直播间',
          roomID: this.chatInfo.groupId
        })
        promise.then((imResponse) => { // 创建成功
          console.log(imResponse.data.group.groupID, '创建成功')// 创建的群的 ID
          this.enterRoom()

        }).catch((imError) => {
          if (imError.code === 10021 || imError.code === 10025) {
            this.enterRoom()
          }
        })
      },
      // 加入直播间
      enterRoom() {
        this.im.enterRoom(this.chatInfo.groupId).then((imResponse) => {
          const status = imResponse.data.status
          if (status === this.TWebLive.TYPES.ENTER_ROOM_SUCCESS || status === this.TWebLive.TYPES.ALREADY_IN_ROOM) {
            this.isJoined = true
          }
        }).catch((imError) => {
          if (imError.code === 10007 || imError.code === 10015) {
            this.$store.commit('showMessage', { type: 'warning', message: '进入直播间失败' })
          }
        })
      },
      onLiveEnd() {
        this.$store.commit('showMessage', { type: 'warning', message: '直播已结束' })
      },
      onNetStateChange(event) {
        this.$store.commit('showMessage', this.checkoutNetState(event.data))
      },
      onKickedOut(event) {
        this.$store.commit('showMessage', {
          message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
          type: 'error'
        })
        this.$store.commit('toggleIsLogin', true)
        this.$store.commit('reset')
      },
      imgError(item) {
        item.avatar = require('../../assets/image/default.png')
      },
      kickedOutReason(type) {
        switch (type) {
          case this.TWebLive.TYPES.KICKED_OUT_MULT_ACCOUNT:
            return '由于多实例登录'
          case this.TWebLive.TYPES.KICKED_OUT_MULT_DEVICE:
            return '由于多设备登录'
          case this.TWebLive.TYPES.KICKED_OUT_USERSIG_EXPIRED:
            return '由于 userSig 过期'
          default:
            return ''
        }
      },
      handleMobileInputFocus() {
        window.scroll(0, 400)
        this.focus = true
      },
      handleMobileInputBlur() {
        //this.sendTextMessage()

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
      checkLogin() {
        this.messageContent = ''
        this.$store.commit('showMessage', {
          message: '请先登录',
          type: 'warning'
        })
        this.$store.commit('toggleIsLogin', true)
      },
      sendTextMessage() {
        window.scroll(0, 0)    //ios键盘回落
        // if (!this.showMessage) {
        //   this.showMessage = true
        // }
        if (this.messageContent === '' || this.messageContent.trim().length === 0) {
          this.messageContent = ''
          this.$store.commit('showMessage', {
            message: '不能发送空消息哦！',
            type: 'info'
          })
          return
        }
        let message = {
          payload: {
            text: ''
          }
        }
        message.nick = this.userInfo.nickName
        message.avatar = this.userInfo.avatar
        message.payload.text = this.messageContent
        message.type = 'TIMTextElem'
        message.status = 'unsend'
        message.to = this.chatInfo.groupId
        message.time = Date.now() / 1000
        this.$store.commit('pushCurrentMessageList', message)
        this.im.sendTextMessage({
            roomID: this.chatInfo.groupId,
            priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
            text: this.messageContent
          })
          .then(() => {
          })
          .catch(error => {
            message.status = 'fail'
            //JSON.stringify(error, ['message', 'code'])
            if (error.code === 80001) {
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
  // 点赞组件
  .canvas-box {
    bottom 35px
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
        font-size 14px
        line-height: 22px
        color #f5a623
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
    padding 2px 65px 2px 20px
    bottom 0
    display flex
    justify-content space-between
    box-sizing border-box
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
    margin 0 12px 0 0
  }

  .send-header-bar i:hover {
    color #FFFFFF
  }

  .el-input /deep/ {
    width 60%
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
  }

  .send-btn {
    /*display flex*/
    position relative
    height 32px
    margin 0 5px

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
