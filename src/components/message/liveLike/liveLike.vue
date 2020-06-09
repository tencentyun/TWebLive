<template>
    <div class="live-like">
        <div class="like-box" :id="'like'+'-'+ item.id" v-for="(item,index) in queue" :key="index"   style="opacity: 1; z-index: 0; transform: translate3d(0px, 0px, 0px);">
            <img class="like-icon"  :src="item.image" />
        </div>
           <img class="like-img" @click="sendCustomMessage" src="../../../assets/image/like.png" />
    </div>
</template>

<script>
  // import { decodeText } from '../../utils/decodeText'
  import { mapState } from 'vuex'
  import image1 from './images/1.png'
  import image2 from './images/2.png'
  import image3 from './images/3.png'
  import image4 from './images/8.png'
  import image5 from './images/5.png'
  import image6 from './images/6.png'
  import image7 from './images/7.png'


  export default {
    name: 'newChat',
    props: {
      // count: {
      //   type: Number,
      //   // value: 0,
      //   // observer: "likeChange"
      // }
    },
    components: {

    },
    data() {
      return {
        image1:image1,
        image2:image2,
        image3:image3,
        image4:image4,
        image5:image5,
        image6:image6,
        image7:image7,
        queue: [],
        image: [image1,image2,image3,image4,image5,image6,image7],
        imageIndex:Math.floor(Math.random() * (4 - 0 + 1)) + 0,
        likeIndex:0,
        timer:0,
        // WIDTH: 90,
        // HEIGHT:300,
        badges:{},
        // anmationData:{
        //   id: new Date().getTime(),
        //   timer: 0,
        //   opacity: 0,
        //   pathData: this.generatePathData(),
        //   factor: {
        //     speed: 0.005, // 运动速度，值越小越慢
        //     t: 0 //  贝塞尔函数系数
        //   }
        // },
        form: {
          data: '',
          description: '',
          extension: ''
        },

      }
    },
    computed: {
      ...mapState({
        isSDKReady: state => state.user.isSDKReady,
        likeCount: state => state.conversation.likeCount,
        userInfo: state => state.user.userInfo,
        chatInfo: state => state.conversation.chatInfo,
        currentMessageList: state => state.conversation.currentMessageList,
        userID: state => state.user.userID
      })

    },
    watch: {
      likeCount() {
        this.likeClick()
      },
    },
    created() {
    },
    mounted() {

    },
    methods: {
      sendCustomMessage() {
        this.form.data = 'like'
        this.form.description = ''
        this.form.extension = ''
        if (!this.isSDKReady) {
          this.$store.commit('showMessage', {
            message: '请先登录',
            type: 'warning'
          })
          this.$store.commit('toggleIsLogin', true)
          return
        }
        this.tweblive.sendCustomMessage({
          roomID: this.chatInfo.groupId,
          priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }).then(() => {
          this.likeClick()
          // this.$store.commit('toggleLike', true)
          // this.$store.commit('pushCurrentMessageList', res.data.message)
        })
          .catch(error => {
            this.$store.commit('showMessage', {
              type: 'error',
              message: error.message
            })
          })
      },
      likeClick() {
        this.imageIndex = Math.floor(Math.random() * (4 - 0 + 1)) + 0
        const anmationData1 = {
          id: new Date().getTime(),
          timer: 0,
          opacity: 0,
          pathData: this.generatePathData(),
          image: this.image[this.imageIndex],
          // imageIndex:Math.floor(Math.random() * (4 - 0 + 1)) + 0,
          factor: {
            speed: 0.005, // 运动速度，值越小越慢
            t: 0 //  贝塞尔函数系数
          }
        }
        // let imageIndex = Math.floor(Math.random() * (4 - 0 + 1)) + 0
        // const anmationData2 = {
        //   id: new Date().getTime() -10,
        //   timer: 0,
        //   opacity: 0,
        //   pathData: this.generatePathData(),
        //   image: this.image[imageIndex],
        //   factor: {
        //     speed: 0.005, // 运动速度，值越小越慢
        //     t: 0 //  贝塞尔函数系数
        //   }
        // }

        if (Object.keys(this.queue).length > 0) {
          this.queue.push(anmationData1)
        } else {
          this.queue.push(anmationData1)
          this.bubbleAnimate()
        }
      },
      getRandom(min, max) {
        return Math.random() * (max - min) + min
      },
      generatePathData() {
        const p0 = { x: 60, y: 450 }
        const p1 = {
          x: this.getRandom(20, 30),
          y: this.getRandom(200, 300)
        }
        const p2 = {
          x: this.getRandom(0, 80),
          y: this.getRandom(100, 200)
        }
        const p3 = {
          x: this.getRandom(0, 80),
          y: this.getRandom(0, 50)
        }
        return [p0, p1, p2, p3]
      },

      updatePath(data, factor) {
        const p0 = data[0] // 三阶贝塞尔曲线起点坐标值
        const p1 = data[1] // 三阶贝塞尔曲线第一个控制点坐标值
        const p2 = data[2] // 三阶贝塞尔曲线第二个控制点坐标值
        const p3 = data[3] // 三阶贝塞尔曲线终点坐标值

        const t = factor.t

        /*计算多项式系数*/
        const cx1 = 3 * (p1.x - p0.x)
        const bx1 = 3 * (p2.x - p1.x) - cx1
        const ax1 = p3.x - p0.x - cx1 - bx1

        const cy1 = 3 * (p1.y - p0.y)
        const by1 = 3 * (p2.y - p1.y) - cy1
        const ay1 = p3.y - p0.y - cy1 - by1

        /*计算xt yt的值 */
        const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x
        const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y
        return {
          x,
          y
        }
      },
      bubbleAnimate() {
        this.queue.forEach(item => {
          const anmationData = item
          const { x, y } = this.updatePath(
            anmationData.pathData,
            anmationData.factor
          )
          const speed = anmationData.factor.speed
          anmationData.factor.t += speed
          const id = `like-${anmationData.id}`
          this.$nextTick(() => {
            const ele = document.getElementById(id)
           if (ele) {
             ele.style.transform = `translate3d(${x}px,${y}px,0)`
             ele.style.opacity = 1 - anmationData.factor.t

           }
          })
          if (anmationData.factor.t > 1) {
            this.queue.splice(this.queue.findIndex(item => item.id === anmationData.id),1)
          }
        })
        if(this.queue.length > 0) {
           this.timer = window.requestAnimationFrame(this.bubbleAnimate)
        }else{
           cancelAnimationFrame(this.timer)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .live-like {
        position absolute
        right 0
        bottom 100px
        z-index 199
    }
    .like-box{
        position: absolute;
        bottom 420px
        right 80px
        }
        .like-icon{
            display block
            width 32px

        }
        .like-img {
            /*cursor pointer*/
        display block
        width 40px
        height 40px
        position absolute
        right 20px
        /*bottom 30px*/
    }
    @media screen and (max-width: 767px){
        .live-like {
            bottom 160px
        }
        .like-img {
            right 20px
        }
    }
</style>
