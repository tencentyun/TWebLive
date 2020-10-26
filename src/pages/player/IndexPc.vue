<template>
  <div class="pusher-container">
    <div class="live-pc">
      <Header/>
      <div class="login-container" v-if="showLogin" >
        <Login/>
      </div>
      <div class="container-pc">
        <div class="pusher-box">
          <Player/>
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
  import NewChat from '../../components/chatroom/chat-pc'
  import Header from '../../components/header/header'
  import Player from '../../components/player/playerPc'
  import Login from '../../components/login/cdn-play-login'



  export default {
    title: 'im',
    components: {
      Header,
      NewChat,
      Player,
      Login,
    },
    data() {
      return {
      }

    },

    computed: {
      ...mapState({
        showLogin: state => state.conversation.showLogin,
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
        isSDKReady: state => state.user.isSDKReady,
        userID: state => state.conversation.chatInfo.userId
      }),
    },
    destroyed() {
      this.$store.commit('reset')
      this.exitRoom()

      // this.logout()
    },

    methods: {

      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {
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
    z-index 1
    background #2B2C2F;
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
      margin 60px 0 20px 0
      height calc(100% - 80px)
      overflow-x auto
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
          background #34363B
          color #000
          margin-right 20px
        }

        .pusher-box {
          /*width 60%*/
          position relative
          flex 1
          height 100%
          background url("../../assets/image/video-gb.png") no-repeat
          margin-left 20px
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

  @media screen and (min-width: 1500px) and (max-width: 2000px) {
    .pusher-container .live-pc {

      width 95%
    }
    .pusher-container .live-pc .container-pc .chat-container {
      width 30%
      min-width 380px
      max-width 490px
    }
  }
    @media screen and (min-width: 2000px) {
      .pusher-container .live-pc {

        width 90%
      }
    }

</style>
