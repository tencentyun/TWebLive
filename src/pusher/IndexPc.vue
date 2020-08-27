<template>
  <div class="pusher-container">
    <div class="live-pc">
      <Header @logout="logout"/>
      <div class="container-pc">
        <div class="pusher-box">
          <Pusher/>
        </div>
        <div class="chat-container">
          <NewChat/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import NewChat from './message/chat-room'
  import Header from './header'
  import Pusher from './pusher'
  import { isMobile } from '../utils/mobile'

  export default {
    title: 'im',
    components: {
      Header,
      NewChat,
      Pusher,
    },
    data() {
      return {
        drawer: false,
        direction: 'rtl',
        isJoined: false,
        isMobile: isMobile(),
        mobileImg: false,
      }

    },

    computed: {
      ...mapState({
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
        isSDKReady: state => state.user.isSDKReady,
        userID: state => state.conversation.chatInfo.userId
      }),
      // 是否显示 Loading 状态
      showLoading() {
        return !this.isJoined
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': {
        handler() {
          if (!this.isLogin) {
            this.$router.replace('/')
            // this.logout()
          }
        },
        'immediate': true
      }
    },
    destroyed() {
      this.logout()
    },

    methods: {
      fetchData() {

      },
      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = false
        })
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
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  .cursor {
    cursor pointer
  }

  .pusher-container {
    z-index 999
    background #ffffff;
    width 100%
    height 100%
    position absolute;
    top 0
    left 0
    right 0
    left 0
    display flex
    margin auto
    justify-content center
    align-items center
    flex-direction column

    .login-container {
      display flex
      justify-content center
      align-items center
      flex-direction column
      //padding-top: 100px;
    }

    .selected-container {
      box-sizing border-box
      width: 920px;
      position: absolute;
      height: 500px;
      background: #fff;
      margin: 0 auto;
      box-shadow: 0 2px 20px 0 rgba(144, 147, 153, .21);
      border-radius: 20px;
      /*padding: 40px 56px;*/
      overflow: hidden;
      display flex
      padding 150px 100px

      .selected-box {
        width 200px
        height 200px
        border-radius 40px
        display flex
        font-size 20px
        color #ffffff
        letter-spacing 3px
        justify-content center
        align-items center
        margin 0 auto
      }

      .anchor {
        background #2d8cf0
        opacity 0.8
      }

      .anchor:hover, .audience:hover {
        opacity 1
      }

      .audience {
        background #f5a623
        opacity 0.8

      }
    }

    .live-pc {
      width 100%
      margin 80px 0 20px 0
      height 100%

      .live-header {
        height 60px
      }

      .container-pc {
        //padding-top 100px    //头部，后续加
        position relative
        display flex
        justify-content space-between
        /*height 100%*/
        /*overflow: hidden*/
        height 100%

        .chat-container {
          position relative
          width 25%
          max-width 420px
          min-width 360px
          background #ffffff
          color #ffffff
          margin-left 10px
          border-radius 5px 5px 0 0
          margin-right 20px
        }

        .pusher-box {
          /*width 60%*/
          flex 1
          height 100%
          padding 0px 80px
          /*border 1px solid #d2dadd*/
          /*border-top: 1px solid #d2dadd*/
          //width: $width;
          /*min-width 600px*/
          margin-left 20px
          box-shadow 0 11px 20px 0 rgba(0, 0, 0, 0.3)

        }

      }


    }
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
    border none
  }

  /deep/ .el-drawer {
    width 100% !important
  }


  @media screen  and (max-width: 1000px) {
    .pusher-container .live-pc {
      overflow-x auto
    }
  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    .pusher-container .live-pc {
      width 100%
    }
  }

  @media screen and (min-width: 1500px) {
    .pusher-container .live-pc {

      width 90%
    }

    .pusher-container .live-pc .container-pc .chat-container {
      width 30%
      min-width 380px
      max-width 490px
    }

  }

</style>
