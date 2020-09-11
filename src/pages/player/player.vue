<template>
    <div >
        <IndexMobile v-if="isMobile"></IndexMobile>
        <IndexPc v-else></IndexPc>
    </div>

</template>

<script>
  import { isMobile } from '../../utils/mobile'
  import  IndexMobile from './IndexMobile'
  import  IndexPc from './IndexPc'

  export default {
    name: 'player',
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

<style scoped>

</style>
