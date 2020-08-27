<template>
  <div id="app">
    <!--        <router-view></router-view>-->
    <Login v-if="!isLogin"></Login>
    <div v-if="isLogin && !isMobile">
      <pusherPc v-if="isPusher"></pusherPc>
      <playerPc v-else></playerPc>
    </div>
    <div v-if="isLogin && isMobile">
      <pusherMobile v-if="isPusher"></pusherMobile>
      <playerMobile v-else></playerMobile>
    </div>
  </div>
</template>


<script>
  import { mapState } from 'vuex'
  import pusherPc from './pusher/IndexPc'
  import playerPc from './player/IndexPc'
  import pusherMobile from './pusher/IndexMobile'
  import playerMobile from './player/IndexMobile'
  import Login from './components/sms-login/index'
  import { isMobile } from './utils/mobile'

  export default {
    name: 'App',
    components: {
      Login,
      pusherPc,
      playerPc,
      pusherMobile,
      playerMobile
    },
    data() {
      return {
        isMobile: isMobile()
      }
    },
    created() {
    },
    computed: {
      ...mapState({
        isLogin: state => state.user.isLogin,
        chatInfo: state => state.conversation.chatInfo,
      }),
      // 是否显示 Loading 状态
      isPusher() {
        return this.chatInfo.role === 'pusher'
      }
    },
  }
</script>

<style lang="stylus">
  html {
    height 100%
    width 100%
    overflow hidden
  }

  body {
    margin 0
    height 100%
    width 100%
    overflow hidden
    background-color #ffffff
    font-family 'Microsoft YaHei', '微软雅黑', 'MicrosoftJhengHei', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif
    /*-ms-overflow-style: none;*/
    /*overflow: auto;*/

  }

  #app {
    height 100%
    font-family: Roboto, PingFang SC !important;
    -webkit-font-smoothing: antialiased;
  }

  .vconsole-box {
    position fixed
    top 0
    right 0
    color #ffffff
    width 50px
    height 50px
    z-index 1001
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width 0
    height 0
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius 10px
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius 10px;
    background rgba(0, 0, 0, 0.1)
  }

</style>
