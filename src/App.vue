<template>
  <div style="height:100%">
      <IndexMobile v-if="isMobile" />
      <IndexPc v-else  ref="IndexPc"/>
  </div>
</template>

<script>
import IndexPc from './IndexPc.vue'
import IndexMobile from './IndexMobile.vue'
import {isMobile} from './utils/mobile'
export default {
  name: 'App',
  components: {
    IndexPc,
    IndexMobile
  },
  data() {
    return {
      isMobile: isMobile()
    }
  },
}
</script>

<style  lang="stylus" >
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
        background-color #09090c
        font-family 'Microsoft YaHei', '微软雅黑', 'MicrosoftJhengHei', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif
        -ms-scroll-chaining chained
        -ms-overflow-style none
        -ms-content-zooming zoom
        -ms-scroll-rails none
        -ms-content-zoom-limit-min 100%
        -ms-content-zoom-limit-max 500%
        -ms-scroll-snap-type proximity
        -ms-scroll-snap-points-x snapList(100%, 200%, 300%, 400%, 500%)
        /*-ms-overflow-style: none;*/
        /*overflow: auto;*/

    }
   .vconsole-box{
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
