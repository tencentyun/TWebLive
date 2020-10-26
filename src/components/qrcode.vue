<template>
  <div>
    <img :src="final_img" class="result-img" v-if="final_img"/>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  export default {
    props:['url'],
    data() {
      return {
        final_img: ''
      }
    },
    methods: {
      generateQR(text) {
        return QRCode.toDataURL(text)
      }
    },
    created() {
      let url = this.url
      this.generateQR(url).then(res => {
        this.final_img = res
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .result-img {
    display block
    width 110px
    height  110px
    margin 0 auto
  }
  @media screen and (max-width: 600px) {
    .result-img {
      display block
      width 200px
      height  200px
      margin 0 auto
    }
  }

</style>
