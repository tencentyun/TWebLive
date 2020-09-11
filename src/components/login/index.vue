<template>
  <div class="login-container">
    <div class="login-wrapper">
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
        <el-form-item v-if="hasToken" prop="userID">
          <div class="label-item active">
            <label class="input-label">用户ID:</label>
            <el-input id="userID" v-model="form.userID"
                      placeholder=""
                      type="text"
                      :disabled="true">

            </el-input>
          </div>
          <!--            <el-input id="userID" v-model="form.userID" type="text" :disabled="true"></el-input>-->
        </el-form-item>
        <el-form-item prop="roomID">
          <div class="label-item" :class="{active:isActive.roomID || form.roomID!==''}">
            <label class="input-label">房间号:
              <el-tooltip class="item" v-if="!isMobile" effect="dark" content="房间号:请填写数字哦~，最大长度18位" placement="right-start">
                <img class="tips-img cursor" src="../../assets/image/tips.png">
              </el-tooltip>
              <img class="tips-img" v-else @click="ShowTips" src="../../assets/image/tips.png">

            </label>
<!--             todo 移动端文字提示-->

            <tips></tips>
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
        <template v-if="!hasToken">
          <el-form-item prop="phoneNum">
            <div class="label-item" :class="{active:isActive.phoneNum || form.phoneNum!==''}">
              <label class="input-label">手机号:</label>
              <el-input id="phoneNum" v-model="form.phoneNum"
                        @focus="isActive.phoneNum=true"
                        @blur="form.phoneNum===''? isActive.phoneNum=false:true"
                        placeholder=""
                        type="number">

              </el-input>
            </div>
          </el-form-item>
          <el-form-item class="get-code-item" prop="verifyCode">
            <div class="label-item" :class="{active:isActive.verifyCode || form.verifyCode!==''}">
              <label class="input-label">验证码:</label>
              <el-input id="verifyCode" v-model="form.verifyCode"
                        @focus="isActive.verifyCode=true"
                        @blur="form.verifyCode===''? isActive.verifyCode=false:true"
                        placeholder=""
                        type="number">

              </el-input>
            </div>
            <!--          <el-input id="verifyCode" v-model="form.verifyCode" placeholder="验证码" type="text"></el-input>-->
            <span id="sendCode" class="send-code" :class="[!canGetCode ? 'counter' : '']" @click="getVerifyCode">{{sendCodeBtnText}}</span>
          </el-form-item>
        </template>
        <el-form-item>
          <el-radio @change="selecteRoleHandler" v-model="form.selecteRole" label="pusher">主播</el-radio>
          <el-radio @change="selecteRoleHandler" v-model="form.selecteRole" label="player">观众</el-radio>
        </el-form-item>

        <el-form-item v-if="form.selecteRole==='pusher'">
<!--          <span class="resolution-text">分辨率:</span>-->
          <div class="label-item">
          <label class="input-label">分辨率:</label>
          <el-select v-model="form.resolution" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-im-btn" type="primary" @click="login" :loading="loading">
            <span style="font-size: 16px;font-weight: 600">进入房间</span>
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasToken">
          <el-button class="logout-account-btn" type="default" @click="exitAccount">退出账号</el-button>
        </el-form-item>
      </el-form>
      <!--                    webrtc能力检测-->
      <div v-if="isTest || form.selecteRole==='pusher'">
        <CapabilityTest :isTest="isTest"></CapabilityTest>
      </div>

    </div>
    <div class="guide-box" v-if="showGuide">
      <img src="../../assets/image/guide.png">
        <span class="guide-text" style="margin-bottom: 10px">点击右上角 “ ··· ”</span>
        <p class="guide-text">请在safari浏览器中打开 “ 腾讯云 Web 直播互动组件 ” </p>
    </div>
  </div>
</template>

<script>
  import { Form, FormItem } from 'element-ui'
  import axios from 'axios'
  import txcLogo from '../../assets/image/login-log.png'
  import { isMobile } from '../../utils/mobile'
  import CapabilityTest from '../test/test'
  import { isMobileType } from '../../utils/common'
  import Tips from '../base/tips'

  // 手机号验证码登录缓存key
  const WEB_LIVE_SMS_LOGIN_INFO = 'web_live_sms_login_info'

  export default {
    name: 'SmsLogin',
    components: {
      Tips,
      ElForm: Form,
      ElFormItem: FormItem,
      CapabilityTest: CapabilityTest
    },
    data() {
      return {
        hasToken: false,
        isMobile: isMobile(),
        sessionID: '',
        canGetCode: true, // 控制获取验证码button
        sendCodeBtnText: '获取验证码',
        isTest: false,
        showGuide: false,
        form: {
          roomID: '',
          phoneNum: '',
          verifyCode: '',
          userID: '',
          selecteRole: '',
          resolution: '720p'
        },
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
        rules: {},
        txcLogo: txcLogo,
        loading: false,
        roomLabel: '',
        isActive: {
          roomID: false,
          phoneNum: false,
          verifyCode: false,
        }
      }
    },
    created() {

      if (isMobileType.iOS() && !isMobileType.isSafari()) {
        this.showGuide = true
      } else {
        this.showGuide = false
      }
      let webLiveSmsLoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
      webLiveSmsLoginInfo = webLiveSmsLoginInfo ? JSON.parse(webLiveSmsLoginInfo) : {}
      const { roomID = '', userID = '', token = '',  loginTime = 0, role } = webLiveSmsLoginInfo
      // token 30天过期 设置29天时重新发送验证码，避免token过期时登录异常
      if (token && (loginTime + 29 * 24 * 60 * 60 * 1000 > Date.now())) {
        this.hasToken = true
        this.form.roomID = roomID
        this.form.userID = userID
        this.roomLabel = '房间号'
        this.form.selecteRole = role
        // this.form.resolution = resolution
      } else {
        localStorage.removeItem(WEB_LIVE_SMS_LOGIN_INFO)
        this.hasToken = false
        this.roomLabel = ''
      }
    },
    mounted() {

    },
    methods: {
      ShowTips() {
        this.$store.commit('showTips', { status: true, content:'房间号:请填写数字哦~，最大长度18位' })
      },
      selecteRoleHandler(value) {
        if (value === 'pusher') {
          this.isTest = true
        } else {
          this.isTest = false
        }
      },
      // 获取手机验证码
      getVerifyCode() {
        if (this.canGetCode) {
          axios(`https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/sms?method=getSms&phone=${this.form.phoneNum.trim()}`)
            .then((res) => {
              if (res.data.errorCode === 0) {
                this.sessionID = res.data.data.sessionId
                this.canGetCode = false
                this.startCountDown()
                return
              }
              this.handleLoginFail(res.data.errorCode)
            })
            .catch(() => {
              this.$store.commit('showMessage', { message: '发送验证码失败', type: 'error' })
            })
        }
      },
      // 通过验证码获取IM登录凭证
      loginWithCode() {
        axios(`https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/sms?method=login&phone=${this.form.phoneNum.trim()}&code=${this.form.verifyCode.trim()}&sessionId=${this.sessionID}`)
          .then((res) => {
            if (res.data.errorCode === 0) {
              const { token, phone, userId: userID, userSig } = res.data.data
              let webLiveSmsLoginInfo = {
                loginTime: Date.now(),
                token: token,
                phone: phone,
                userSig:userSig,
                roomID: this.form.roomID,
                userID: userID,
                role: this.form.selecteRole,
                resolution: this.form.resolution
              }
              localStorage.setItem(WEB_LIVE_SMS_LOGIN_INFO, JSON.stringify(webLiveSmsLoginInfo))
              let _LoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
              const LoginInfo = JSON.parse(_LoginInfo)
              this.$store.commit('setChatInfo', LoginInfo)
              this.$store.commit('setRole', this.form.selecteRole)
              this.$store.commit('toggleIsLogin', true)
              this.$store.commit('showMessage', { message: '登录成功', type: 'success' })
              if (this.form.selecteRole === 'pusher' ) {
                this.$router.push('/pusher')

              }
              if ( this.form.selecteRole === 'player') {
                this.$router.push('/player')
              }

              // this.webLiveLogin(userID, userSig)
              return
            }
            this.handleLoginFail(res.data.errorCode)
          })
          .catch(() => {
            this.$store.commit('showMessage', { message: '获取签名失败', type: 'error' })
          })
      },
      // 通过token获取IM登录凭证
      loginWithToken() {
        let webLiveSmsLoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
        const { token, phone } = JSON.parse(webLiveSmsLoginInfo)
        axios(`https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/sms?method=login&phone=${phone}&token=${token}`)
          .then((res) => {
            if (res.data.errorCode === 0) {
              const { userId: userID, userSig } = res.data.data
              let webLiveSmsLoginInfo = {
                loginTime: Date.now(),
                userSig:userSig,
                token: token,
                phone: phone,
                roomID: this.form.roomID,
                userID: userID,
                role: this.form.selecteRole,
                resolution: this.form.resolution
              }
              localStorage.setItem(WEB_LIVE_SMS_LOGIN_INFO, JSON.stringify(webLiveSmsLoginInfo))
              let _LoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
              const LoginInfo = JSON.parse(_LoginInfo)
              this.$store.commit('setChatInfo', LoginInfo)
              this.$store.commit('setRole', this.form.selecteRole)
              this.$store.commit('toggleIsLogin', true)

              this.$store.commit('showMessage', { message: '登录成功', type: 'success' })
              if (this.form.selecteRole === 'pusher' ) {
                this.$router.push('/pusher')

              }
              if ( this.form.selecteRole === 'player') {
                this.$router.push('/player')
              }

              // this.webLiveLogin(userID, userSig)
              return
            }
            this.handleLoginFail(res.data.errorCode)
          })
          .catch(() => {
            this.$store.commit('showMessage', { message: '操作异常', type: 'error' })
          })
      },
      // 倒计时
      startCountDown() {
        let time = 60 // 60s
        this.sendCodeBtnText = `${time}s`
        let timer = setInterval(() => {
          time--
          if (time < 0) {
            time = 0
            clearInterval(timer)
            this.canGetCode = true
          }
          this.sendCodeBtnText = `${time}s`
          if (this.canGetCode) {
            this.sendCodeBtnText = '获取验证码'
          }
        }, 1000)
      },
      // // WEBLIVE 登录
      // webLiveLogin(userID, userSig) {
      //   this.im.login({
      //     userID: userID,
      //     userSig: userSig
      //   }).then(() => {
      //     this.loading = false
      //     this.$store.commit('setRole', this.form.selecteRole)
      //     let webLiveSmsLoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
      //     const { token, phone } = JSON.parse(webLiveSmsLoginInfo)
      //     let _webLiveSmsLoginInfo = {
      //       loginTime: Date.now(),
      //       token: token,
      //       phone: phone,
      //       roomID: this.form.roomID,
      //       userID: userID,
      //       userSig: userSig,
      //       role: this.form.selecteRole,
      //       resolution: this.form.resolution
      //     }
      //     localStorage.setItem(WEB_LIVE_SMS_LOGIN_INFO, JSON.stringify(_webLiveSmsLoginInfo))
      //     let _LoginInfo = localStorage.getItem(WEB_LIVE_SMS_LOGIN_INFO)
      //     const LoginInfo = JSON.parse(_LoginInfo)
      //     this.$store.commit('setChatInfo', LoginInfo)
      //     this.$store.commit('showMessage', { message: '登录成功', type: 'success' })
      //     this.$store.commit('toggleIsLogin', true)
      //
      //     if (this.form.selecteRole ==='pusher' ) {
      //       this.$router.push('/pusher')
      //
      //     }
      //     if ( this.form.selecteRole ==='player') {
      //       this.$router.push('/player')
      //     }
      //
      //
      //   }).catch((err) => {
      //     this.loading = false
      //     console.log(err)
      //     this.$store.commit('showMessage', { message: '登录失败', type: 'error' })
      //   })
      // },
      // 登录
      login() {
        this.loading = true
        if (this.hasToken) {
          this.loginWithToken()
          return
        }
        this.isTest = false
        this.loginWithCode()
      },
      // 处理登录失败的情况
      handleLoginFail(code) {
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
      exitAccount() {
        localStorage.removeItem(WEB_LIVE_SMS_LOGIN_INFO)
        this.roomLabel = ''
        this.hasToken = false
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
    background rgba(0, 0, 0, 0.84)
    z-index 9999
    padding 0 20px

    & img {
      width 100%
      height 200px
    }

    .guide-text {
      font-size 20px
      line-height 32px
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
    width 760px
    background $white
    color $black
    padding-bottom 30px
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
          color #1162F9
          cursor pointer
          border-radius 20px
          border 1px solid #1162F9
          line-height 34px

        .counter
          color #777
          font-size 14px

      .login-im-btn, .logout-account-btn
        width 100%
        border 1px solid #1162F9
        border-radius 20px
        & span
          font-size 14px



    .loginFooter
      color: #8c8a8a c7
      text-align: center
      padding: 0 0 20px 0
      cursor: pointer


  /*input     */

  .el-input /deep/ {
    border-bottom 1px solid #eaeaea
    outline none
    /*margin-left 20px*/
  }

  .active .el-input /deep/ {
    border-bottom 1px solid #1162F9
    outline none
  }

  .el-input /deep/ .el-input__inner {
    /*color #ffffff*/
    // background linear-gradient(90deg,#32374d,#262b44);
    /*border-radius 50%*/
    margin-bottom 3px
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
    margin-bottom 15px
  }

  .resolution-text {
    color: #999;
    padding-right 10px

  }
  .tips-img {
    display inline-block
    width 20px
    height 20px
  }
  .label-item {
    position: relative;

    .input-label {
      z-index 2
      top: -20px;
      left: 0px;
      position: absolute;
      -webkit-transform: translateY(22px) scale(1);
      transform: translateY(22px) scale(1);
      display: block;
      color: #606060;
      -webkit-transform-origin: top left;
      transform-origin: top left;
      -webkit-transition: color .2s cubic-bezier(0, 0, .2, 1) 0ms, -webkit-transform .2s cubic-bezier(0, 0, .2, 1) 0ms;
      transition: color .2s cubic-bezier(0, 0, .2, 1) 0ms, -webkit-transform .2s cubic-bezier(0, 0, .2, 1) 0ms;
      transition: color .2s cubic-bezier(0, 0, .2, 1) 0ms, transform .2s cubic-bezier(0, 0, .2, 1) 0ms;
      transition: color .2s cubic-bezier(0, 0, .2, 1) 0ms, transform .2s cubic-bezier(0, 0, .2, 1) 0ms, -webkit-transform .2s cubic-bezier(0, 0, .2, 1) 0ms;
    }
  }

  .label-item.active .input-label {
    color: #606060;
    -webkit-transform: translateY(1.5px) scale(.75);
    transform: translateY(1.5px) scale(.75);
    left: 0;
  }

  /deep/ input::-webkit-inner-spin-button {
    display none
  }

  //移动端
  @media screen  and (max-width: 776px) {
    .login-wrapper {
      width 92%

    }

    .login-wrapper .loginBox {
      width 90%
    }
  }


</style>
