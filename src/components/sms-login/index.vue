<template>
    <div class="login-container">
        <div class="login-wrapper">
            <!-- 顶部三个蓝条 -->
            <div class="row-div" style="width: 100%; height: 10px">
                <div style="width: 190px; height: 100%; background-color: #006EFF"></div>
                <div style="width: 160px; height: 100%; background-color: #00A4FF"></div>
                <div style="width: 100px; height: 100%; background-color: #5AD5E0"></div>
            </div>
            <!-- 腾讯云logo -->
            <div class="row-div" style="width: 100%; height: 100px; justify-content: center">
                <img style="height: 23px" :src="txcLogo" alt="">
                <div style="width: 9px"></div>
                <div style="width: 1px; height: 10px; background-color: #D8D8D8"></div>
                <div style="width: 9px"></div>
                <div  style="width: 115px; height: 23px; padding-top: 8px; font-size: 18px; color: #333333">直播互动组件</div>
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
                <el-form-item prop="roomID">
                    <div class="label-item" :class="{active:isActive.roomID || form.roomID!==''}">
                        <label class="input-label">房间号:</label>
                        <el-input id="roomID" v-model.number="form.roomID"
                                  type='number'
                                  @focus="isActive.roomID=true"
                                  @blur="form.roomID===''? isActive.roomID=false:true"
                                  placeholder=""
                                  maxLength='18'
                                  >

                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-radio @change="selecteRoleHandler" v-model="form.selecteRole" label="pusher">主播</el-radio>
                    <el-radio @change="selecteRoleHandler" v-model="form.selecteRole" label="player">观众</el-radio>
                </el-form-item>

                <el-form-item v-if="form.selecteRole==='pusher'">
                    <span class="resolution-text">分辨率:</span>
                    <el-select v-model="form.resolution" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="streamID" v-if="form.selecteRole==='pusher'">
                    <div class="label-item" :class="{active:isActive.streamID || form.streamID!==''}">
                        <label class="input-label">流名称:</label>
                        <el-input id="streamID" v-model="form.streamID"
                                  @focus="isActive.streamID=true"
                                  @blur="form.streamID===''? isActive.streamID=false:true"
                                  placeholder=""
                                  type="text">

                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-im-btn"  type="primary" @click="webLiveLogin" :loading="loading" >进入房间</el-button>
                </el-form-item>
<!--                <el-form-item  v-if="hasToken">-->
<!--                    <el-button class="logout-account-btn" type="default" @click="exitAccount">退出账号</el-button>-->
<!--                </el-form-item>-->
            </el-form>
<!--                    webrtc能力检测-->
            <div v-if="isTest || form.selecteRole==='pusher'">
                <CapabilityTest :isTest="isTest"></CapabilityTest>
            </div>

        </div>
        <div class="guide-box" v-if="showGuide">
            <img src="../../assets/image/guide-1.png">
            <p class="guide-text">请在safari浏览器中打开 “ 腾讯云 Web 直播互动组件 ” </p>
        </div>
    </div>
</template>

<script>
import { Form, FormItem } from 'element-ui'
import axios from 'axios'
import txcLogo from '../../assets/image/txc-logo.png'
import { isMobile } from '../../utils/mobile'
import CapabilityTest from '../test/test'
import { isMobileType } from '../../utils/common'

// 手机号验证码登录缓存key
const WEB_LIVE_SMS_LOGIN_INFO = 'web_live_sms_login_info'

export default {
  name: 'SmsLogin',
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    CapabilityTest:CapabilityTest
  },
  data() {
    return {
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
      options: [{
        label:'640 x 360',
        value: '360p',
      }, {
        label:'1280 x 720',
        value: '720p',
      }, {
        label:'1920 x 1080',
        value: '1080p',
      }],
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
  created () {

    if (isMobileType.iOS() && !isMobileType.isSafari()) {
      this.showGuide = true
    } else {
      this.showGuide = false
    }
    let webLiveSmsLoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
    webLiveSmsLoginInfo = webLiveSmsLoginInfo ? JSON.parse(webLiveSmsLoginInfo) : {}
    const { roomID = '', userID = '', streamID = '', role, resolution } = webLiveSmsLoginInfo

      this.form.roomID = roomID
      this.form.userID = userID
      this.form.streamID = streamID
      this.form.selecteRole = role
      this.form.resolution = resolution
  },
  mounted() {

  },
  methods: {
    selecteRoleHandler(value) {
      if (value === 'pusher') {
        //this.$router.push('/pc-pusher')
        this.isTest = true
      }else{
        this.isTest = false
        //this.$router.push('/pc-player')
      }
    },
    // WEBLIVE 登录
    webLiveLogin () {
      let userID = this.form.userID
      let userSig = window.genTestUserSig(this.form.userID).userSig
      this.im.login({
        userID: userID,
        userSig: userSig
      }).then(() => {
        this.loading = false
        this.$store.commit('toggleIsLogin', true)
        this.$store.commit('setRole', this.form.selecteRole)
        let _webLiveSmsLoginInfo = {
          loginTime: Date.now(),
          roomID: this.form.roomID,
          userSig:userSig,
          userID: userID,
          streamID: this.form.streamID,
          role: this.form.selecteRole,
          resolution: this.form.resolution
        }
        localStorage.setItem(WEB_LIVE_SMS_LOGIN_INFO, JSON.stringify(_webLiveSmsLoginInfo))
        let _LoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
        const LoginInfo = JSON.parse(_LoginInfo)
        this.$store.commit('setChatInfo', LoginInfo)
        this.$store.commit('showMessage', { message: '登录成功', type: 'success' })
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.$store.commit('showMessage', { message: '登录失败', type: 'error' })
      })
    },
    // 处理登录失败的情况
    handleLoginFail (code) {
      this.loading = false
      let message = ''
      switch (code) {
        case -1001:
          message = '缺少参数'
          break
        case -1002:
          message = '手机号格式不对'
          break
        case -1003:
          message = '验证码发送失败'
          break
        case -1004:
          message = '方法名不存在'
          break
        case -1005:
          message = 'token错误'
          break
        case -1006:
          message = 'token已过期，输入短信验证码重新登录'
          break
        case -1007:
          message = '手机号与token不匹配'
          break
        case -1100:
          message = '验证码已失效'
          break
        case -1101:
          message = '验证码已过期'
          break
        case -1102:
          message = '验证码错误'
          break
        case -1103:
          message = 'sessionID不匹配'
          break
        case -1201:
          message = '该手机号尚未注册'
          break
        default:
          message = '操作异常'
          break
      }
      this.$store.commit('showMessage', { message: message, type: 'error' })
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
.guide-box {
   position fixed
   left 0
   right 0
   bottom 0
   top 0
   background rgba(0,0,0,0.84)
   z-index 9999
   padding 0 20px
   & img {
       width 100%
       height 200px
   }
    .guide-text {
        font-size 20px
        line-height  32px
        color #ffffff
        & i {
            width 1px
            height 1px
            border-radius 50%
            background #ffffff
        }
    }

}
.login-container {
    width 100%
    height 100%
    background-color #ffffff
    display flex
    justify-content center
    align-items center
    //padding-top: 100px;
}
.login-wrapper
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
