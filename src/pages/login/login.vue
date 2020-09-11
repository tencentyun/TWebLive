<template>
    <div class="login-container">
        <SmsLogin/>
    </div>
</template>

<script>
  import SmsLogin from '../../components/login/index'

  export default {
    name: 'login',
    components: {
      SmsLogin
    },
    data() {
      return {}
    },
  }
</script>

<style lang="stylus" scoped>
    .login-container
        width 100%
        height 100%
        background-color #ffffff
        display flex
        justify-content center
        align-items center

</style>
