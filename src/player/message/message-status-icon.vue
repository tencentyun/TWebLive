<template>
  <div
      style="width:16px;height:16px;"
      :class="messageIconClass"
      @click="handleIconClick"
  >{{messageIconClass==='message-send-fail'? '!':''}}
  </div>
</template>

<script>
  export default {
    name: 'MessageStatusIcon',
    props: {
      message: {
        type: Object,
        required: true
      }
    },
    computed: {
      messageIconClass() {
        switch (this.message.status) {
          case 'unSend':
            return 'el-icon-loading'
          case 'fail':
            return 'message-send-fail'
          default:
            return ''
        }
      }
    },
    methods: {
      handleIconClick() {
        if (this.messageIconClass === 'message-send-fail') {
          this.$store.commit('pushCurrentMessageList', this.message)
          this.tweblive.sendTextMessage({
              roomID: this.message.to,
              priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
              text: this.message.payload.text
            })
            .then(() => {
              this.message.status = 'success'
            })
            .catch(error => {
              this.message.status = 'fail'

              //JSON.stringify(error, ['message', 'code'])
              if (error.code === 80001) {
                error.message = '文本中可能包含敏感词汇'
              }
              this.$store.commit('showMessage', {
                type: 'error',
                message: error.message
              })
            })
        }

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .message-send-fail {
    display inline-block
    background-color: #f35f5f;
    color: $white;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    cursor: pointer;
    position: absolute;
    right: -25px;
    vertical-align: middle;
    top: 0;
    bottom: 0;
    margin: auto;
  }
</style>
