<template>
  <div class="container-mobile">
    <div class="container-mobile">
      <img class="quit-btn" @click="open" src="../../assets/image/back-img.png"/>
      <div class="login-container" v-if="showLogin" >
        <Login/>
      </div>
      <div class="video-box">
        <Player></Player>
      </div>
      <div ref="chat" class="chat-mobile">
        <NewChat/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import NewChat from '../../components/chatroom/chat-mobile'
  import Player from '../../components/player/playerMobile'
  import Login from '../../components/login/cdn-play-login'
  export default {
    title: 'TWebLive DEMO',
    components: {
      Player,
      NewChat,
      Login
    },
    data() {
      return {
      }

    },
    computed: {
      ...mapState({
        showLogin: state => state.conversation.showLogin,
        chatInfo: state => state.conversation.chatInfo,

      }),
    },

    destroyed() {
      this.$store.commit('reset')
      this.exitRoom()
      // this.logout()
    },
    methods: {
      open() {
        this.$confirm('确认要退出吗？退出之后不能再观看直播了哦~', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.replace('/')
        }).catch(() => {
          this.$store.commit('showMessage', {
            message: '已取消退出',
            type: 'info'
          })
        })
      },

      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {

          }).catch(() => {

        })
      },
      login() {
        this.$store.commit('toggleIsLogin', true)
        // this.$emit()
      },
      _logout() {
        this.im.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          console.log('观众退出直播间', this.chatInfo.groupId)
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },
      async logout() {
        if (!this.isSDKReady && !this.isMobile) {
          this.$router.replace('/')
          return
        }
        await this.exitRoom()
        await this._logout()
       // window.location.reload()
      }
    }
  }
</script>

<style scoped lang="stylus">
  .container-mobile {
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    width 100%
    height 100vh
    margin 0 auto
    z-index 1
    overflow hidden
    .video-box {
      width 100%
      height 100%
      position relative
      overflow hidden
      //background #09090c //rgba(0,0,0,0.8)
    }

    .quit-btn {
      z-index 1000
      position absolute
      top 7px
      bottom 0
      right 10px
      width 35px
      height 35px
    }

    .chat-mobile {
      position fixed
      /*height 210px*/
      width 100%
      bottom 55px
      display flex
      justify-content center
      /deep/ .send-box {
        width: calc(100% - 70px);
      }
      .summary-text {
        padding 5px 20px
        line-height 25px
        color #ffffff
      }
    }

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

      .title-item {
        display: block;
        width: 50px;
        margin 0 40px
      }
    }

    .login-container {
      z-index 1000
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      display flex
      justify-content center
      align-items center
      flex-direction column
      //padding-top: 100px;
    }

    .chat {
      display flex
      justify-content center
      position relative
      height auto

      .summary-text {
        padding 5px 20px
        line-height 25px
        color #ffffff
      }
    }
  }

  .text-ellipsis {
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  }

  .active {
    border-bottom 2px solid #f5a623
    color #f5a623
  }


  /deep/ .vcp-player {
    width 100%
    position relative
  }

  /deep/ .vcp-bigplay {
    display none
  }

  /deep/ .vcp-error-tips {
    color #FFFFFF
    margin-top: -4.25em

  }

  .text-ellipsis {
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  }
</style>
