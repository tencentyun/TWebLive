<template>
    <div class="container-pusher">
        <IndexMobile v-if="isMobile"></IndexMobile>
        <IndexPc v-else></IndexPc>
    </div>

</template>

<script>
  import { isMobile } from '../../utils/mobile'
  import  IndexMobile from './IndexMobile'
  import  IndexPc from './IndexPc'

  export default {
    name: 'pusher',
    data() {
      return {
        isMobile:isMobile()
      }
    },
    components: {
      IndexMobile,
      IndexPc
    }
  }
</script>

<style scoped lang="stylus">
    .container-pusher {
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        width 100%
        height 100%
        z-index 33
        background url("../../assets/image/mobile-bg.png") no-repeat center
        background-size cover
        background-color rgb(113 109 109,1)

    }

</style>
