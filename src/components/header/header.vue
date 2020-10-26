<template>
  <div>
    <el-dialog title="编辑个人资料" :visible.sync="showEditMyProfile" width="80%">
      <el-form v-model="form" label-width="100px">
        <el-form-item label="头像">
          <el-input v-model="form.avatar" placeholder="头像地址(URL)"/>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nick" placeholder="昵称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="showEditMyProfile = false">取 消</el-button>
                <el-button type="primary" @click="setMyProfile">确 定</el-button>
            </span>
    </el-dialog>
    <div class="direct-one"  :class="{ 'direct-two' : fullPath ==='/' }">
      <div class="direct-security">
        <slot>
          <div class="direct-one-title">
            <img class="logo-img" src="../../assets/image/logo.png"/>
            <span class="room-num">直播房间（ID-{{chatInfo.groupId}}）</span>
            <slot>
              <span class="push-text" v-if="pushInfo.isPushing">直播中...</span>
            </slot>
          </div>
          <div  style="margin-right: 10px;position: absolute;right: 28%;cursor: pointer">
            <el-popover
                    placement="top-end"
                    title=""
                    width="200"
                    trigger="hover"
                    content=""
            >
              <div>
                <div style="display: flex;justify-content: space-around">
                  <p class="share-title">扫码分享</p>
                  <p class="share-title">复制链接分享</p>
                </div>
                <p  class="share-title" v-if="!pushInfo.playUrl" style="font-size: 12px">开启画面传输就可以分享哦~</p>
                <p class="share-text" v-else>扫码手机观看或分享给好友</p>
                <div class="qr-box" v-if="pushInfo.playUrl">
                  <QRCode class="share-qr"  :url="pushInfo.playUrl"/>
                  <el-divider direction="vertical"></el-divider>
                  <span class="copy-btn cursor" v-clipboard:copy="pushInfo.playUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
                  <img class="copy-img" src="../../assets/image/copy-1.png">
                </span>
                </div>
              </div>
              <div slot="reference"  style="">
                <img class="share-img" src="../../../src/assets/image/share2.png" />
                <span style="margin-left: 3px;color: #ffffff;font-size: 16px;font-weight: 900">分享观看地址</span>
              </div>

            </el-popover>
          </div>
        </slot>
        <div class="rel" :class="{ '_rel' : fullPath ==='/' }">
          <div class="to-login cursor" v-if="!isSDKReady" @click="login">登录</div>
          <el-dropdown v-else @command="handleCommand">
            <div style="display: flex">
              <img class="header-img" :src="userInfo.avatar" @error="imgError(userInfo)"/>
              <span class="header-text">{{(!userInfo.nickName || userInfo.nickName === '\'\'' || userInfo.nickName === '""') ? userID : userInfo.nickName }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="setProfile">修改信息</el-dropdown-item>
              <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import QRCode from '../qrcode'

  export default {
    name: 'Header',
    components:{
      QRCode
    },
    data() {
      return {
        showEditMyProfile: false,
        form: { avatar: '', nick: '' }
      }
    },
    computed: {
      ...mapState({
        fullPath:state => state.conversation.fullPath,
        showLogin: state => state.conversation.showLogin,
        playType: state => state.conversation.playType,
        pushInfo:state => state.conversation.pushInfo,
        chatInfo: state => state.conversation.chatInfo,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
        isSDKReady: state => state.user.isSDKReady,
        userID: state => state.conversation.chatInfo.userId
      }),
    },
    created() {
    // this.login()
    },
    methods: {
      onCopy (e) {
        this.$store.commit('showMessage', {
          message: '链接已复制到剪贴板',
        })
      },
// 复制失败时的回调函数
      onError (e) {
        this.$store.commit('showMessage', {
          message: '抱歉，复制失败！',
          type:'error'
        })
      },
      login() {

        this.$store.commit('showLogin', true)
        // this.$emit()
      },
      handleCommand(command) {
        if (command === 'setProfile') {
          this.showEditMyProfile = true
        }
        if (command === 'outLogin') {
          this.open()
        }
      },
      open() {
        this.$confirm('确认要退出登录吗？退出之后不能再参与直播互动!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout()
          // this.$emit('logout')
        }).catch(() => {
          this.$store.commit('showMessage', {
            message: '已取消退出',
            type: 'info'
          })
        })
      },

      exitRoom() {
        this.im.exitRoom(this.chatInfo.groupId).then(() => {

        })
      },
      _logout() {
        this.im.logout().then(() => {
          this.$store.commit('toggleIsSDKReady', false)
          this.$router.push('/')
          // this.$store.commit('reset')
          this.$store.commit('showMessage', { type: 'success', message: '退出成功' })
        })
      },

      async logout() {
        if (this.isSDKReady) {
          await this.exitRoom()
          await this._logout()
          // window.location.reload()
        }
      },

      // 没有昵称或者昵称为''或者""的，都用 userID 展示
      canIUseNick(nick) {
        if (nick && nick !== '""' && nick !== '\'\'') {
          return true
        }
        return false
      },
      imgError(item) {
        item.avatar = require('../../assets/image/default.png')
      },
      setMyProfile() {
        if (this.form.avatar && this.form.avatar.indexOf('http') === -1) {
          this.$store.commit('showMessage', {
            message: '头像应该是 Url 地址',
            type: 'warning'
          })
          this.form.avatar = ''
          return
        }
        const options = {}
        // 过滤空串
        Object.keys(this.form).forEach(key => {
          if (this.form[key]) {
            options[key] = this.form[key]
          }
        })
        this.im.setMyProfile(options)
          .then((imResponse) => {
            this.$store.commit('showMessage', {
              message: '修改成功'
            })
            const { nick, avatar, userID } = imResponse.data
            this.userInfo.nickName = this.canIUseNick(nick) ? nick : userID
            if (avatar) {
              this.userInfo.avatar = avatar
            }
            this.showEditMyProfile = false
          })
          .catch(imError => {
            this.$store.commit('showMessage', {
              message: imError.message,
              type: 'error'
            })
          })
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .cursor {
    cursor: pointer;
  }
  /deep/ .el-dialog {
    max-width 460px
  }
  .el-divider--vertical {
    height auto
    margin 8px 12px
  }
  .direct-one {
    position absolute
    top 0
    left 0
    right 0
    background #2B2C2F
    height 60px
    line-height 60px
    /*z-index 9999*/
    box-shadow 0 2px 2px 0 rgba(0, 0, 0, 0.35)
    margin-bottom 50px
  }
 .direct-two {
     background #ffffff
     box-shadow none
 }

  .direct-security {
    margin 0 auto
    justify-content space-between
    display flex
    width 96%
  }

  .direct-one-title {
    color #2d8cf0 //
    font-size 18px
    width 800px
    display inline-flex
    align-items center
    .logo-img {
      width 32px
      height 32px
    }
    .logo-title {
      margin-left 5px
      padding-left 5px
      border-left 2px solid #d2dadd
      color #000
    }

    .header-room, .header-time {
      margin-left 10px
      margin-right 2px
      width 26px
      height 26px
      vertical-align middle
    }

    .room-num, .time-num {
      margin-left 10px
      color #a9b3c1 //rgba(254,255,254,0.5)
      font-size: 16px
    }
    .push-text{
      font-size: 14px
      color #2d8cf0
    }


  }

  .picture-png {
    display inline-block
    width 24px
    height 24px
    vertical-align middle
    padding-right 10px
  }
 .share-img {
   height 24px
 }
  .rel {
    height 36px
    /*background #2f3035*/
    border-radius 20px
    align-self center
    cursor pointer

    .header-img {
      display block
      width 32px
      height 32px
      margin 2px 0
      border-radius 50%
      vertical-align middle
    }

    .header-text {
      color #6a6a6a
      line-height 36px
      font-size 16px
      padding 0 8px
    }
  }

  .rel .to-login {
    line-height 36px
    width 80px
    height 100%
    background #1162F9
    border-radius 19px
    text-align center
    color #fff
    font-size 14px
    cursor pointer
    transition all ease 0.3s;
  }
  .share-title {
    text-align center
    font-size 14px
    color #444444
    letter-spacing 0
    line-height 22px
  }
  .qr-box{
    display flex
    /*padding 5px 40px*/
    width 400px
    justify-content space-around
    .share-qr{
      width 110px
      height 110px
    }
  }
  .share-text {
    text-align left
    padding-left 10px
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    line-height: 18px;
  }
  .copy-img {
    padding 30px 25px 25px 0
  }

  ._rel{
    margin-top 10px
    margin-right 30px
  }
  @media screen and (min-width: 900px) and (max-width: 1500px) {
    .direct-security {
      width 96%
    }
  }

  @media screen and (min-width: 1500px) {
    .direct-security {
      width 96%
    }
  }

</style>
