<template>
    <div>
        <img :src="final_img" class="result-img" v-if="final_img"/>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        final_img: ''
      }
    },
    methods: {
      generateQR (text) {
        return this.qrcode.toDataURL(text)
      }
    },
    created () {
      let url = window.location.href
      this.generateQR(url).then(res => {
        this.final_img = res
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .result-img{
      width 300px
      height 300px
      margin 0 auto
  }

</style>
