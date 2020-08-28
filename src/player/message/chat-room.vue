<template>
  <div class="chat-wrapper">
    <div class="live-title">
      <span v-for="(item,index) in tabs" :key="index" class="title-item" :class="{active:isActive[index]}"
            @click="tabClick(index)">{{item}}</span>
    </div>
    <div id="message-send-box-wrapper" v-show="this.tabSelected ===0">
      <div class="message-list" ref="message-list" @scroll="this.onScroll">
        <div class="message-box" v-for="message in currentMessageList" :key="message.ID" :message="message">
          <img v-if="textMsg(message.type)" class="message-img" :src="message.avatar" @error="imgError(message)">
          <div class="message-item" v-if="textMsg(message.type)">
            <div style="display: flex">
              <p class="message-nick">{{message.nick}}</p>
              <span class="message-date">{{getDate(message)}}</span>
            </div>
            <div class="message-container">
              <div class="triangle"></div>
              <template v-for="(item, index) in contentList(message.payload.text)">
                <span :key="index" class="message-text" v-if="item.name === 'text'">{{ item.text }}</span>
                <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index"/>
              </template>
              <MessageStatusIcon v-if="message.status==='fail'" :message="message"></MessageStatusIcon>
            </div>

          </div>
          <div class="tip-text" v-if="joinMsg(message.type)"
          >
            <img class="tips-img" src="../../assets/image/guzhang.png">
            <span>{{getGroupTipContent(message)}}</span>
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
        <el-input
            placeholder="发个弹幕呗~"
            v-model="messageContent"
            @focus="focus = true"
            @blur="focus = false"
            @keyup.enter.native="handleEnter"
            @keyup.ctrl.enter.prevent.exact="handleLine"
        >
        </el-input>
        <!--                @change="sendTextMessage"-->

        <div class="send-btn">
          <el-button type="primary" @click="sendTextMessage" round>发送</el-button>
        </div>
      </div>
    </div>
    <liveLike>
      <template slot-scope="{sendCustomMessage}">
        <canvas id="bubble" class="canvas-box"></canvas>
        <img class="like-img cursor" @click="sendCustomMessage()" src="../../assets/image/like.png"/>
      </template>
    </liveLike>
    <div class="tab-summary" v-show="this.tabSelected ===1">
      <p class="summary-text">腾讯云 Web 直播互动组件，以腾讯云 Web 超级播放器 - TcPlayer 和腾讯云即时通信 IM - TIM 为基础，封装了简单易用的 API，提供了免费开源的
        Demo，方便开发者快速接入和使用。适用于 Web 直播互动场景，如大型会议、活动、课程、讲座等的在线直播，带货直播的微信 H5 分享等。</p>
      <p class="summary-text">欢迎在github提issue哦~</p>
      <p class="summary-text" style="font-size: 15px">github: https://github.com/tencentyun/TWebLive</p>
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
      MessageStatusIcon
    },
    data() {
      return {
        isActive: [1, ''],
        tabs: ['互动', '介绍'],
        tabSelected: 0,  //互动
        messageContent: '',
        isSendCustomMessage: false,
        sendCustomDialogVisible: false,
        surveyDialogVisible: false,
        form: {
          data: '',
          description: '',
          extension: ''
        },
        file: '',
        emojiMap: emojiMap,
        emojiName: emojiName,
        emojiUrl: emojiUrl,
        showAtGroupMember: false,
        atUserID: '',
        focus: false
      }
    },
    computed: {
      ...mapState({
        isSDKReady: state => state.user.isSDKReady,
        isLogin: state => state.user.isLogin,
        userInfo: state => state.user.userInfo,
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        userID: state => state.conversation.chatInfo.userId
      }),
      contentList() {
        // console.log(this.currentMessageList)
        return (text) => {
          return decodeText(text)
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
        // messageList.forEach(() => {
        //   this.$store.commit('showLike',1)
        // })
      },
      onRemoteUserJoin({ data: messageList }) {
        messageList.forEach((message) => {
          const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
          message.payload.text = `欢迎 ${userName} 进入直播间 `
          message.type = 'Live-Join'
        })
        if (this.isSDKReady) {
          this.$store.commit('pushCurrentMessageList', messageList)
        }
      },
      onLiveEnd() {
        this.$store.commit('showMessage', { type: 'warning', message: '直播已结束' })
      },
      onRemoteUserLeave({ data: messageList }) {
        messageList.forEach((message) => {
          const userName = this.canIUseNick(message.nick) ? message.nick : message.payload.userIDList[0]
          message.payload.text = `${userName} 离开了直播间`
          message.type = 'Live-Leave'
        })
        this.$store.commit('pushCurrentMessageList', messageList)
      },
      onError({ data }) {
        if (data.message !== '' && data.message !== 'Network Error') {
          // this.$store.commit('showMessage', {
          //   message: data.message,
          //   type: 'error'
          // })
        }

      },
      showMobile() {
        this.mobileImg = true

      },
      onReadyStateUpdate({ name }) {
        const isSDKReady = name === this.TWebLive.EVENT.IM_READY ? true : false
        this.$store.commit('toggleIsSDKReady', true)
        console.log('player12345654')

        if (isSDKReady) {
          this.getMyProfile()
          this.enterRoom()
        }
      },
      // 加入直播间
      enterRoom() {
        this.im.enterRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = true
        }).catch((imError) => {
          if (imError.code === 10007 || imError.code === 10015) {
            this.$store.commit('showMessage', { type: 'error', message: '你加入的直播间不存在哦~' })
          }
        })
      },
      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = false
        })
      },
      getMyProfile() {
        this.im.getMyProfile().then((res) => {
          this.userInfo.nickName = this.canIUseNick(res.data.nick) ? res.data.nick : this.userID,
            this.userInfo.avatar = res.data.avatar || this.userInfo.defaultImg
        }).catch(() => {
          // console.warn('getMyProfile error:', imError)// 更新资料失败的相关信息
        })
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
      checkoutNetState(state) {
        switch (state) {
          case this.TWebLive.TYPES.NET_STATE_CONNECTED:
            return { message: '已接入网络', type: 'success' }
          case this.TWebLive.TYPES.NET_STATE_CONNECTING:
            return { message: '当前网络不稳定', type: 'warning' }
          case this.TWebLive.TYPES.NET_STATE_DISCONNECTED:
            return { message: '当前网络不可用', type: 'error' }
          default:
            return ''
        }
      },
      _logout() {
        this.im.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          this.$store.commit('toggleIsLogin', false)
          // this.$store.commit('reset')
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },

      async logout() {
        if (this.isSDKReady) {
          await this.exitRoom()
          await this._logout()
          window.location.reload()
          // this.enterRoom()
        }
        this.$router.replace('/')
      },
      onNetStateChanged(event) {
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
      tabClick(index) {
        // window.scroll(0, 0)    //切换tab，聊天区域滑到底部
        this.isActive = ['', '']
        this.isActive[index] = 1
        this.tabSelected = index
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
      onScroll({ target: { scrollTop } }) {
        let messageListNode = this.$refs['message-list']
        if (!messageListNode) {
          return
        }
        if (this.preScrollHeight - messageListNode.clientHeight - scrollTop < 20) {
          // this.isShowScrollButtomTips = false
        }
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
      // isMine(type) {
      //   return type === 'isMine'
      // },
      leaveMsg(type) {
        return type === 'Live-Leave'
      },
      textMsg(type) {
        return type === 'TIMTextElem'
      },
      joinMsg(type) {
        return type === 'Live-Join'
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
        if (!this.isSDKReady) {
          this.checkLogin()
          return
        } else {
          if (
            this.messageContent === '' ||
            this.messageContent.trim().length === 0
          ) {
            this.messageContent = ''
            this.$store.commit('showMessage', {
              message: '不能发送空消息哦！',
              type: 'info'
            })
            return
          }
          let message = {
            payload: {
              text: '',
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
              if (error.code === 80001) {
                error.message = '文本中可能包含敏感词汇'
              }
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
          this.messageContent = ''
        }

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
  .like-img {
    bottom 80px
  }

  .cursor {
    cursor: pointer;
  }

  .canvas-box {
    bottom 130px
  }

  //tab样式
  .live-title {
    display flex
    justify-content center
    height 40px
    line-height 40px
    color #ffffff
    text-align center
    margin 0 auto
    border-bottom 2px solid rgb(0, 0, 0, 0.8)
    font-size 16px
  }

  .active {
    border-bottom 2px solid #f5a623
    color #f5a623
  }

  .title-item {
    display block
    width: 50px
    margin 0 40px
    /*border-bottom: 2px solid #f5a623*/

  }

  .summary-text {
    padding 5px 15px
    line-height 25px
    text-align left
    color #ffffff
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
    bottom 55px
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
    padding-top 30px
    //width: $width;
    width 100%
    height 100%
    max-width 400px
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
    width 100%
    color #ffffff
    text-align center
    background linear-gradient(90deg, #32374d, #262b44)
    /*border-radius 50%*/
    border none
    outline none
    height 38px
    font-size 15px
    line-height 38px
    border-radius 5px
  }

  .message-box {
    font-family Microsoft YaHei, Arial, Helvetica, sans-serif, SimSun
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
        background-color #32374d
        border-radius 3px
        border-top-left-radius: 0
        padding 8px 8px

        .triangle {
          width: 0;
          height: 0;
          /*border-top:5px solid transparent;*/
          border-bottom: 8px solid transparent;
          border-right: 8px solid #32374d;
          position: absolute;
          left: -8px;
          top: 0;
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

    .tip-leave {
      padding 4px 40px
    }

    .message-text {
      font-size 14px
      color #FFFFFF
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

  .send-header-bar {
    width 100%
    position absolute
    bottom 10px
    display flex
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
    cursor pointer
    font-size 28px
    color rgb(245, 166, 35)
    line-height 24px
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
    background linear-gradient(90deg, #32374d, #262b44);
    /*border-radius 50%*/
    border none
    outline none
    height 38px
    line-height 38px
    border-radius 20px
  }

  .send-btn {
    display flex
    padding 0 0 0 12px
  }

  .el-button--primary /deep/ {
    background-color rgb(245, 166, 35)
    border-color rgb(245, 166, 35) //#F5A623
    padding 10px 20px

  }

  textarea {
    resize none
  }
</style>
