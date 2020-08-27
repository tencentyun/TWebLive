<template>
  <div class="player-box">
    <div class="live-pc">
      <Header @logout="logout"/>
      <div class="top-box">
        <span style="color: #ffffff;margin-left: 10px">技术交流 QQ 群:468195767</span>
      </div>

      <div class="container-pc">
        <div class="video-container">
          <player></player>
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
  import player from './player'
  import { isMobile } from '../utils/mobile'

  export default {
    title: 'im',
    components: {
      Header,
      NewChat,
      player,
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
    destroyed() {
      this.logout()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': {
        handler() {
          if (!this.isLogin) {
            this.$router.replace('/')
            this.logout()
          }
        },
        'immediate': true
      }
    },
    methods: {

      _logout() {
        this.im.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          this.$store.commit('toggleIsLogin', false)
          // this.$store.commit('reset')
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },
      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = false
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
  .player-box {
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    width 100%
    height 100vh
    background-color #09090cf5

    .live-pc {
      width 90%
      margin 0 auto
      height 32px

      .top-box {
        color #ffffff
        margin 80px 0 20px 0
        cursor pointer

        & span {
          color #E4E4E4
          height 32px
          line-height 32px
          font-size 14px
          vertical-align top
        }
      }

      .container-pc {
        //padding-top 100px    //头部，后续加
        position relative
        display flex

        .video-container {
          float left
          flex 1
          min-width 600px
          height 80vh

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
          background #000 //#141520
          color #ffffff
          margin-left 10px
          border-radius 5px 5px 0 0
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

  @media screen  and (max-width: 1000px) {
    .container-pc {
      overflow-x auto
    }
  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    .live-pc {
      width 85%
    }
  }

  @media screen and (min-width: 1500px) {
    .live-pc {
      width 70%
    }
  }

</style>
