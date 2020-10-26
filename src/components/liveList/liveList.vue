<template>
    <div class="live-list">
        <el-dialog title="直播" :visible.sync="showEditLive">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="直播名称">
                    <el-input v-model="form.title" placeholder="输入直播间名称"/>
                </el-form-item>
<!--                <el-form-item label="简介">-->
<!--                    <el-input v-model="form.des" placeholder="输入简介"/>-->
<!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditLive = false">取 消</el-button>
                <el-button type="primary" @click="pusherHandler">确 定</el-button>
            </span>
        </el-dialog>
        <div class="header-box">
            <img  class="logo-img" src="../../assets/image/logo-list.png"/>
        </div>
        <div class="login-container" v-show="showLogin && fullPath==='/'" >
            <Login/>
        </div>
        <div class="live-top">
            <div class="text-box">
                <p class="top-title">开启直播更简单</p>
                <p class="top-text">网页端直播一体化解决方案，与世界分享你的精彩</p>
                <span class="pusher-btn" @click="initLive">我要直播</span>
            </div>
        </div>
        <div class="title-box">
            <p class="live-title">发现直播</p>
        </div>
        <div class="live-container">
            <div class="list-box" v-if="liveRoom.length !==0">
                <div class="live-item" :key=index v-for="(item, index) in liveRoom">
                    <div class="item-box" @click="playerHandler(item.roomId, item.anchorId,item.title)">
                        <p>
                            <img class="live-img"  :src="item.url"/>
                            <el-tooltip v-if="!isMobile" class="item" effect="dark" :content="item.title || item.roomId" placement="top-start">
                                <span class="live-name">{{item.title || item.roomId}}</span>
                            </el-tooltip>
                            <span  v-else class="live-name">{{item.title || item.roomId}}</span>

                        </p>
                        <p>
                            <span class="live-btn">去围观</span>
                        </p>
                    </div>
                </div>

            </div>
            <div v-else>
                <img  class="empty-img" src="../../assets/image/live-empty.png">
                <p class="empty-text">当前没有直播，新建直播，你就是独一无二的星光主播啦~</p>
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
  import axios from 'axios'
  import { mapState } from 'vuex'
  import MTA from '../../../src/utils/mta'
  import { isMobile } from '../../../src/utils/mobile'
  import Login from '../../components/login/index'
  import { isMobileType } from '../../utils/common'
  import img1 from  '../../assets/image/live-img/img-1.png'
  import img2 from  '../../assets/image/live-img/img-2.png'
  import img3 from  '../../assets/image/live-img/img-3.png'
  import img4 from  '../../assets/image/live-img/img-4.png'
  import img5 from  '../../assets/image/live-img/img-5.png'
  import img6 from  '../../assets/image/live-img/img-6.png'
  export default {
    name: 'liveList',
    components: {
      Login
    },
    data() {
      return {
        showGuide:false,
        isPusherUser:false,
        isMobile:isMobile(),
        form: {
          title:'',
        },
        showEditLive:false,
        liveRoom:[],
        img_list:[img1, img2, img3, img4, img5, img6]

      }
    },

    computed: {
      ...mapState({
        fullPath:state => state.conversation.fullPath,
        showLogin: state => state.conversation.showLogin,
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        userInfo: state => state.user.userInfo,
        isLogin: state => state.user.isLogin,
        isSDKReady: state => state.user.isSDKReady,
        userID: state => state.conversation.chatInfo.userId
      }),
    },
    created() {
      this._stat()
      this.getList()

    },
    updated() {

    },
    methods: {
      _stat() {
        // 统计 PV
        MTA.pgv()
      },
      initLive() {
        this.isPusherUser = true
        this._stat()
        if (isMobileType.iOS() && !isMobileType.isSafari()) {
          this.showGuide = true
          return
        } else {
          this.showGuide = false
        }
        if (!this.isLogin) {
          this.$store.commit('showLogin', true)
        } else {
          if ( this.isMobile ) {
            this.$router.push({ name: 'pusher', params: { create: true } })
            return
          }
          this.showEditLive = true
        }


        // this.$router.push('/pusher')
      },
      pusherHandler() {
        // this.$store.commit('setGroupId', this.form.roomId)
        this.showEditLive = false
        this.creatLive()
        // this.$router.push(,title)

      },
      /**获取最大最小之前随机值的整数 */
      getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      creatLive() {
        let title = this.form.title
        axios (`https://service-62h5r0ea-1252463788.gz.apigw.tencentcs.com/release/forTestAdvanced?method=createRoom&appId=1400188366&type=liveRoom&title=${title}&anchorId=${this.chatInfo.userId}`)
          .then((res) => {
            console.log('liveRoom创建成功', res.data.roomId)
            this.$store.commit('setGroupId', res.data.roomId)
            // this.createRoom()
            this.$router.push('/pusher')

          })
          .catch(() => {
            this.$store.commit('showMessage', { message: '失败', type: 'error' })
          })
      },
      getList() {
        axios ('https://service-c2zjvuxa-1252463788.gz.apigw.tencentcs.com/release/forTestAdvanced?method=getRoomList&appId=1400188366&type=liveRoom')
          .then((res) => {
            this.liveRoom = res.data.data
            this.liveRoom.forEach((item)=> {
              item.url = this.img_list[this.getRandomInt(0, 5)]
            })
          })
          .catch(() => {
            this.$store.commit('showMessage', { message: '失败', type: 'error' })
          })
      },
      playerHandler(roomId, anchorId, title) {
        this.isPusherUser = false
        this._stat()
        this.$store.commit('setGroupId', roomId)
        let _title = title || roomId
        // this.enterRoom()
        this.$router.push({ path: '/player', query: { anchorId: anchorId, title:_title } })
        // this.$router.push({ path: '/news', query: { userId: 123 }});

      }
    }
  }

</script>

<style scoped lang="stylus">
    .live-list {
        background #F9F9F9
        width 100%
        position relative
        height 100%
        overflow-y scroll
        .live-top {
            width 100%
            height 350px
            background url("../../../src/assets/image/live-banner.jpg") no-repeat
            background-size cover
            position relative

            .text-box {
                top 0
                left 0
                right 0
                bottom 0
                margin auto
                position absolute
                color #ffffff
                text-align center
                .top-title {
                    margin-top 100px
                    font-family: PingFangSC-Medium;
                    font-size: 48px;
                    color: #FFFFFF;
                    text-align: center;
                    margin-bottom 25px
                }
                .top-text{
                    font-size 24px
                }
                .pusher-btn{
                    /*width 400px*/
                    /*height 45px*/
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #FFFFFF;
                    display inline-block
                    padding 10px 150px
                    background: #2864F0;
                    border-radius: 30px;
                    margin-top 80px
                    cursor pointer
                    text-align center

                }
            }
        }

        .live-title {
            text-align left
            margin 40px
            margin-bottom 0
            font-family: PingFangSC-Medium;
            font-size: 24px;
            color: #333333;
        }
        .live-container {
            /*width 90%*/
            margin 0 auto
            display flex
            flex-direction column
            justify-content center
            align-items center
        }
        .list-box {
            /*margin  40px*/
            display inline-flex
            justify-content center
            flex-wrap wrap
            /*overflow-y scroll*/
            //height calc(100% - 480px)
            .live-item{
                border: 1px solid #F2F3F8;
                box-shadow: 0 5px 15px 0 rgba(0,0,0,0.05);
                margin 15px
                min-width 380px
                height 130px
                /*display inline-flex*/
                background #ffffff
                border-radius 4px
                display flex
                justify-content center
                align-items center
                box-sizing border-box
                .item-box{
                    height 60px
                    width 90%
                    margin 0 auto
                    display flex
                    justify-content space-between
                    cursor pointer
                }
                .live-img{
                    width 60px
                    height 60px
                    margin-right 10px
                }
                .live-name{
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    font-size 18px
                    color #333333
                    line-height 60px
                    height 40px
                    width 180px
                    /*text-align center*/
                    display inline-block
                    font-family PingFangSC-Medium
                }
                .live-btn{
                    /*width 80px*/
                    /*height 36px*/
                    padding 6px 12px
                    border 1px solid #DDDDDD
                    border-radius 18px
                    font-size 12px
                    line-height 60px
                    cursor pointer
                }
            }


        }

    }
    .empty-img{
        display block
        margin 0 auto
        margin-top 30px
        height 200px
        margin-bottom 40px
    }
    .empty-text {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #888888;
        line-height: 18px;
    }
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

    .header-box {
        position relative
        width 100%
        background #ffffff
        height 60px
        line-height 60px
        z-index 1
        box-shadow 0 2px 2px 0 rgba(0, 0, 0, 0.35)
    }
    .logo-img{
        height 30px
        /*margin-top 15px*/
        margin-left 30px
    }

    .live-dialog{
        width 600px
    }
    @media screen  and (max-width: 1000px) {
        .list-box {
        }
        .title-box{
           width 100%
        }
    }

    @media screen and (min-width: 1200px) and (max-width: 1500px) {
        .list-box {
            width 1230px
        }
        .title-box{
            width 1230px
        }
        /deep/ .el-dialog{
            width 40%
        }
    }
        //适配大屏
    @media screen  and (min-width: 1500px) {
        .list-box {
            width 90%
        }
        .title-box{
            width 85%
            margin-left 80px
            margin-bottom 20px
        }
        .live-list .live-top .text-box .top-title {
            margin-top 200px
        }
        .live-list .live-top {
            min-height 550px
        }
        .live-list .list-box {
            //height calc(100% - 680px)
        }
        /deep/ .el-dialog{
            width 40%
        }
    }
    //适配移动端
    @media screen  and (max-width: 700px) {

        .list-box {
            width 90%
        }
        .title-box{
            width 85%
            margin-left 80px
            margin-bottom 20px
        }
        .live-list .live-top {
            background url("../../../src/assets/image/mobile-list-bg.png") no-repeat
            background-size cover
            position relative
            height 260px

        }
        .live-list .live-top .text-box .top-title {
            margin-top 80px
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #FFFFFF;
            line-height: 28px;
        }

        .live-list .live-top .text-box .top-text{
            font-family: PingFangSC-Light;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 22px;
        }
        .live-list .live-top .text-box .pusher-btn{
            background: #2864F0;
            border-radius: 20px;
            padding: 10px 30px;
            margin-top: 30px;
        }

        .live-list .list-box {
            height calc(100% - 365px)
        }
        .title-box{
            width 100%
            margin-left 0
            margin-bottom 0
        }
        .live-list .live-title {
            margin 30px 20px 20px 20px
            font-size 20px
        }
        .live-list .list-box .live-item {
            width 100%
            min-width 100%
            margin:9px 10px
        }
        .live-list .list-box .live-item .live-name{
            font-size 16px
            width: 150px;
        }
        .empty-img {
            height 160px
        }
        /deep/ .el-dialog{
            width 80%
        }
    }
</style>
