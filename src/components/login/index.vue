<template>
    <div class="login-container">
        <div class="login-wrapper">
            <img class="close cursor" :src="close" @click="closeLogin"/>
            <!-- 顶部三个蓝条 -->
            <div class="row-div" style="width: 100%; height: 10px">
                <div style="width: 300px; height: 100%; background-color: #006EFF"></div>
                <div style="width: 160px; height: 100%; background-color: #00A4FF"></div>
                <div style="width: 300px; height: 100%; background-color: #5AD5E0"></div>
            </div>
            <!-- 腾讯云logo -->
            <div class="row-div" style="width: 100%; height: 100px; justify-content: center">
                <img style="height: 23px" :src="txcLogo" alt="">
            </div>
            <!-- 登录操作区-->
            <el-form ref="login" label-width="120" :rules="rules" :model="form" class="loginBox">
                <el-form-item prop="userID">
                    <div class="label-item active">
                        <label class="input-label">用户ID:</label>
                        <el-input id="userID" v-model="form.userID"
                                  placeholder=""
                                  type="text"
                        >

                        </el-input>
                    </div>
                    <!--            <el-input id="userID" v-model="form.userID" type="text" :disabled="true"></el-input>-->
                </el-form-item>
<!--                <el-form-item prop="roomID">-->
<!--                    <div class="label-item" :class="{active:isActive.roomID || form.roomID!==''}">-->
<!--                        <label class="input-label">房间号:</label>-->
<!--                        <el-input id="roomID" v-model.number="form.roomID"-->
<!--                                  type='number'-->
<!--                                  @focus="isActive.roomID=true"-->
<!--                                  @blur="form.roomID===''? isActive.roomID=false:true"-->
<!--                                  placeholder=""-->
<!--                                  maxLength='18'-->
<!--                        >-->

<!--                        </el-input>-->
<!--                    </div>-->
<!--                </el-form-item>-->
                <el-form-item>
                    <el-button class="login-im-btn"  type="primary" @click="webLiveLogin" :loading="loading" >进入房间</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { Form, FormItem } from 'element-ui'
  import axios from 'axios'
  import txcLogo from '../../assets/image/txc-logo.png'
  import { isMobile } from '../../utils/mobile'
  import { isMobileType } from '../../utils/common'
  import close from '../../assets/image/close-login.png'

  // 手机号验证码登录缓存key
  const WEB_LIVE_SMS_LOGIN_INFO = 'web_live_sms_login_info'
  import { mapState } from 'vuex'

  export default {
    name: 'SmsLogin',
    components: {
      ElForm: Form,
      ElFormItem: FormItem,
    },
    data() {
      return {
        close:close,
        hasToken: false,
        isMobile:isMobile(),
        sessionID: '',
        canGetCode: true, // 控制获取验证码button
        sendCodeBtnText: '获取验证码',
        isTest:false,
        showGuide:false,
        form: {
          roomID: '',
          phoneNum: '',
          verifyCode: '',
          userID: '',
          streamID:'',
          selecteRole:'pusher',
          resolution:'720p'
        },
        rules: {},
        txcLogo: txcLogo,
        loading: false,
        roomLabel: '',
        isActive:{
          roomID:false,
          phoneNum:false,
          verifyCode:false,
          streamID:false,
        }
      }
    },
    computed: {
      ...mapState({
        chatInfo: state => state.conversation.chatInfo,
      }),
    },
    created () {
      // this.form.roomID = this.chatInfo.groupId
    },
    mounted() {

    },
    methods: {
      closeLogin() {
        this.$store.commit('showLogin', false)
      },

      webLiveLogin() {
        let userID = this.form.userID
        let userSig = window.genTestUserSig(this.form.userID).userSig
        this.$store.commit('toggleIsLogin', true)
        this.$store.commit('showLogin', false)
        let _webLiveSmsLoginInfo = {
          loginTime: Date.now(),
          roomID: this.form.roomID,
          userID: userID,
          userSig: userSig,
          resolution: this.form.resolution
        }
        this.$store.commit('setChatInfo', _webLiveSmsLoginInfo)
        this.$store.commit('showMessage', { message: '已登录成功，可以创建直播哦~', type: 'success' })


      },
      // 退出账号
      exitAccount () {
        localStorage.removeItem(WEB_LIVE_SMS_LOGIN_INFO)
        this.roomLabel = ''
        // this.hasToken = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .login-container {
        z-index 9999
        /*opacity 0*/
        background rgba(0, 0, 0, 0.5);
        width 100%
        height 100%
        position fixed;
        top 0
        left 0
        justify-content center
        align-items center
        display flex
    }
    .close {
        display block
        width 20px
        height 20px
        position absolute
        right 10px
        top 10px
    }

    .login-wrapper
        position relative
        display flex
        align-items center
        flex-direction column
        width 450px
        background $white
        color $black
        border-radius 5px
        box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3)

        .row-div
            display flex
            justify-content center
            align-items center
            flex-direction row

        .logo
            width 110px
            height 110px

        .loginBox
            width 320px
            margin 0 0 10px 0

            .get-code-item
                position relative

                .send-code
                    position absolute
                    right 0
                    top 0
                    width 112px
                    text-align center
                    color #409EFF
                    cursor pointer

                .counter
                    color #777
                    font-size 14px

            .login-im-btn, .logout-account-btn
                width 100%

        .loginFooter
            color: #8c8a8a c7
            text-align: center
            padding: 0 0 20px 0
            cursor: pointer


    /*input     */

    .el-input /deep/ {
        border-bottom  1px solid #eaeaea
        outline none
        /*margin-left 20px*/
    }
    .active .el-input /deep/ {
        border-bottom  1px solid #2d8cf0
        outline none
    }

    .el-input /deep/ .el-input__inner {
        /*color #ffffff*/
        // background linear-gradient(90deg,#32374d,#262b44);
        /*border-radius 50%*/
        border none
        outline none
        height 24px
        line-height 24px
        border-radius 0px
        display: block;
        margin-top: 18px;
        font-size 16px
        font-family: inherit;
        /*font-size: inherit;*/
    }
    /deep/ .el-input.is-disabled .el-input__inner {
        background-color #ffffff
    }
    /deep/ .el-form-item {
        margin-bottom 10px
    }
    .resolution-text{
        color: #999;
        padding-right 10px

    }
    .label-item{
        position: relative;
        .input-label {
            z-index 2000
            top: -15px;
            left: 0px;
            position: absolute;
            -webkit-transform: translateY(22px) scale(1);
            transform: translateY(22px) scale(1);
            display: block;
            color: #999;
            -webkit-transform-origin: top left;
            transform-origin: top left;
            -webkit-transition: color .2s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .2s cubic-bezier(0,0,.2,1) 0ms;
            transition: color .2s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .2s cubic-bezier(0,0,.2,1) 0ms;
            transition: color .2s cubic-bezier(0,0,.2,1) 0ms,transform .2s cubic-bezier(0,0,.2,1) 0ms;
            transition: color .2s cubic-bezier(0,0,.2,1) 0ms,transform .2s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .2s cubic-bezier(0,0,.2,1) 0ms;
        }
    }
    .label-item.active .input-label {
        color: #999;
        -webkit-transform: translateY(1.5px) scale(.75);
        transform: translateY(1.5px) scale(.75);
        left: 0;
    }
    /deep/ input::-webkit-inner-spin-button {
        display none
    }
    //移动端
    @media screen  and (max-width:776px){
        .login-wrapper {
            width 92%

        }
        .login-wrapper .loginBox {
            width 90%
        }
    }

</style>
