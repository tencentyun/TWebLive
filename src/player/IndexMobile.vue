<template>
  <div class="container-mobile">
    <div class="container-mobile">
      <img class="quit-btn" @click="logout" src="../assets/image/quit.png"/>
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
  import NewChat from '../pusher/message/chat-mobile'
  import { isMobile } from '../utils/mobile'
  import Player from './playerMobile'


  export default {
    title: 'TWebLive DEMO',
    components: {
      Player,
      NewChat
    },
    data() {
      return {
        isActive: [1, ''],
        showPlay: true,
        tabs: ['互动', '介绍'],
        tabSelected: 0,  //互动
        isJoined: false,
        isMobile: isMobile()
      }

    },
    computed: {
      ...mapState({
        isLogin: state => state.user.isLogin,
        chatInfo: state => state.conversation.chatInfo,

      }),
      // 是否显示 Loading 状态
      showLoading() {
        return !this.isJoined
      }
    },

    mounted() {
      // 初始化监听器
      // window.addEventListener('unload', () => {
      //   this.logout()
      // })

    },

    destroyed() {
      this.logout()
    },
    // watch: {
    //   // 如果路由有变化，会再次执行该方法
    //   '$route': {
    //     handler() {
    //       if(!this.isLogin) {
    //         this.$router.replace('/')
    //       }
    //     },
    //     'immediate':true
    //   }
    // },
    methods: {
      // 加入直播间
      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {
          this.isJoined = false
        })
      },
      login() {
        this.$store.commit('toggleIsLogin', true)
        // this.$emit()
      },
      _logout() {
        this.im.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },
      async logout() {
        if (this.isSDKReady) {
          await this.exitRoom()
          await this._logout()
        }
        window.location.reload()
      }
    }
  }
</script>

<style scoped lang="stylus">
  .container-mobile {
    width 100%
    height 100vh
    margin 0 auto
    overflow hidden

    .video-box {
      width 100%
      height 100%
      position relative
      overflow hidden
      background #09090c //rgba(0,0,0,0.8)
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
      position absolute
      /*height 210px*/
      width 100%
      bottom 55px
      display flex
      justify-content center

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

  /deep/ .vcp-panel-bg {
    opacity 0.5
  }

  .text-ellipsis {
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  }
</style>
