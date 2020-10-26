<template>
 <div class="pusher-setting">
     <div class="title-box">
         <p class="pusher-title">直播名称</p>
         <el-input class="pusher-text"  @blur="setValue"
                   v-model="form.title" placeholder="好的直播名称更加吸引观众，最多填写10个字"/>
     </div>
<!--     <p class="pusher-text"> 名称会让你的直播更加吸引观众哦~</p>-->
     <div class="resolution-box">
         <p class="input-label">分辨率:</p>
         <el-select  @change="setValue"  v-model="form.resolution" placeholder="请选择">
             <el-option
                     v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
             </el-option>
         </el-select>
     </div>

     <!--     <el-input-->
<!--             ref="mobileInput"-->
<!--             id="sendInput"-->
<!--             placeholder="来说点什么吧~"-->
<!--             >-->
<!--     </el-input>-->
 </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'pusherSetting',
    data() {
      return {
        form: {
          title:'',
          resolution: '720p'
        },
        value:'720p',
        options: [{
          label: '640 x 360',
          value: '360p',
        }, {
          label: '1280 x 720',
          value: '720p',
        }, {
          label: '1920 x 1080',
          value: '1080p',
        }],
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo,
        pushInfo:state => state.conversation.pushInfo,
      }),
    },

    created() {
      this.form.title = this.pushInfo.title
      this.$store.commit('setPusherInfo', this.form)
    },
    mounted() {

    },
    methods: {
      setValue() {
        this.$store.commit('setPusherInfo', this.form)
      }

    }
  }
</script>

<style scoped lang="stylus">
    .pusher-setting{
        position: absolute;
        top 40px
        right 0
        left 0
        width 90%
        height 180px
        margin auto
        color #ffffff
        z-index 1
        .title-box{
            border-radius 5px
            background-color rgba(0,0,0,0.65)
            padding 20px
        }
        .pusher-title{
            font-size 18px
        }
        .pusher-text{
            height: 14px;
            opacity: 0.6;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #FFFFFF;
        }
    }
        .resolution-box{
            border-radius 5px
            margin-top 2px
            display flex
            background-color rgba(0,0,0,0.65)

            .input-label{
                min-width 80px
                height 40px
                line-height 40px
                margin-left 20px
            }
        }
    /deep/ .el-input__inner{
        background-color rgba(0,0,0,0)
        color #ffffff
        border: 1px solid rgba(255,255,255,0);
        padding 0
        /*height 30px*/
        /*line-height 30px*/
    }
    /deep/ .el-select .el-input__inner:focus {
        border-color: rgba(255,255,255,0);
    }
    /deep/ .el-select .el-input.is-focus .el-input__inner {
        border-color: rgba(255,255,255,0);
    }
</style>
