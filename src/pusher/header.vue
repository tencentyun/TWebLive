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
    <div class="direct-one">
      <div class="direct-security">
        <div class="direct-one-title">
          <p>
            <img src="../assets/image/logo-1.png"/>
            <span class="logo-title">直播互动组件</span>
          </p>
          <p>
            <img class="header-room" src="../assets/image/room-icon.png"/>
            <span class="room-num">ID-{{chatInfo.groupId}}</span>
          </p>
        </div>
        <div class="rel">
          <!--                    <div class="to-login" v-if="!isSDKReady" @click="login">登录</div>-->
          <el-dropdown @command="handleCommand">
            <div style="display: flex">
              <img class="header-img" :src="userInfo.avatar"/>
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

  export default {
    name: 'Header',
    data() {
      return {
        showEditMyProfile: false,
        form: { avatar: '', nick: '' }
      }
    },
    computed: {
      ...mapState({
        chatInfo: state => state.conversation.chatInfo,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
        isSDKReady: state => state.user.isSDKReady,
        userID: state => state.conversation.chatInfo.userId
      }),
    },
    methods: {
      login() {
        this.$store.commit('toggleIsLogin', true)
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
          this.$emit('logout')
        }).catch(() => {
          this.$store.commit('showMessage', {
            message: '已取消退出',
            type: 'info'
          })
        })
      },
      // 没有昵称或者昵称为''或者""的，都用 userID 展示
      canIUseNick(nick) {
        if (nick && nick !== '""' && nick !== '\'\'') {
          return true
        }
        return false
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
  /deep/ .el-dialog {
    max-width 460px
  }

  .direct-one {
    position absolute
    top 0
    left 0
    right 0
    background #ffffff
    height 60px
    line-height 60px
    z-index 9999
    box-shadow 0 2px 2px 0 rgba(0, 0, 0, 0.35)
    margin-bottom 50px
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
      color #a9b3c1 //rgba(254,255,254,0.5)
      font-size: 14px
    }
  }

  .picture-png {
    display inline-block
    width 24px
    height 24px
    vertical-align middle
    padding-right 10px
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
    background #2d8cf0
    border-radius 19px
    text-align center
    color #fff
    font-size 14px
    cursor pointer
    transition all ease 0.3s;
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
