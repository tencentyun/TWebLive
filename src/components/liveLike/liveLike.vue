<template>
  <div class="live-like">
    <slot :sendCustomMessage="sendCustomMessage">
      <canvas id="bubble" class="canvas-box"></canvas>
      <img class="like-img" @click="sendCustomMessage" src="../../assets/image/like1.png"/>
    </slot>
  </div>
</template>

<script>
  // import { decodeText } from '../../utils/decodeText'
  import { mapState } from 'vuex'
  import image1 from './images/bg1.png'
  import image2 from './images/bg2.png'
  import image3 from './images/bg3.png'
  import image4 from './images/bg4.png'
  import image5 from './images/bg5.png'
  import image6 from './images/bg6.png'
  import image7 from './images/bg4.png'


  export default {
    name: 'newChat',
    props: {
      // count: {
      //   type: Number,
      //   // value: 0,
      //   // observer: "likeChange"
      // }
    },
    components: {},
    data() {
      return {
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5,
        image6: image6,
        image7: image7,
        queue: {},
        image: [],
        imageUrl: [image1, image2, image3, image4, image5, image6, image7],
        imageIndex: 0,
        likeIndex: 0,
        timer: 0,
        likeTimer: null,
        ctx: null,
        testImg: null,
        // WIDTH: 90,
        // HEIGHT:300,
        iconWidth: 40,
        realHeight: 300,
        realWidth: 140,
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
        setTimeout(() => {
          this.likeClick()
        }, 0)
        clearTimeout()


      },
    },
    created() {
    },
    mounted() {
      let canvas = document.getElementById('bubble')
      canvas.height = 320
      canvas.width = 90
      this.ctx = canvas.getContext('2d')
      for (let i = 0; i < this.imageUrl.length; i++) {
        this.image[i] = new Image()
        this.image[i].src = this.imageUrl[i]
      }
    },
    methods: {
      sendCustomMessage() {
        this.form.data = 'like'
        this.form.description = ''
        this.form.extension = ''
        if (!this.isSDKReady) {
          this.$store.commit('showLogin', true)
          return
        }
        this.likeClick()
        this.im.sendCustomMessage({
          roomID: this.chatInfo.groupId,
          priority: this.TWebLive.TYPES.MSG_PRIORITY_NORMAL,
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }).then(() => {
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
        let imageIndex = this.getRandomInt(0, this.imageUrl.length - 1)
        let img = this.image[imageIndex]
        const anmationData = {
          id: new Date().getTime(),
          timer: 0, // 定时器
          opacity: 1, //透明度
          pathData: this.generatePathData(), // 路径
          image: img,
          factor: {
            speed: 0.01, // 运动速度，值越小越慢
            t: 0, //  贝塞尔函数系数
          },
          onload: false,
        }
        if (Object.keys(this.queue).length > 0) {
          this.queue[anmationData.id] = anmationData
        } else {
          this.queue[anmationData.id] = anmationData
          this.bubbleAnimate()
        }
      },
      getRandom(min, max) {
        return Math.random() * (max - min) + min
      },
      /**获取最大最小之前随机值的整数 */
      getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      generatePathData() {
        const p0 = {
          x: 50,
          y: 320,
        }
        const p1 = {
          x: this.getRandom(0.2 * this.realWidth, 0.33 * this.realWidth),
          y: this.getRandom(0.5 * this.realHeight, 0.75 * this.realHeight),
        }
        const p2 = {
          x: this.getRandom(0.55 * this.realWidth, 0.85 * this.realWidth),
          y: this.getRandom(0.25 * this.realHeight, 0.5 * this.realHeight),
        }
        const p3 = {
          x: this.getRandom(0.25 * this.realWidth, 0.75 * this.realWidth),
          y: this.getRandom(0, 0.125 * this.realHeight),
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
        this.ctx.clearRect(0, 0, 90, 400)
        Object.keys(this.queue).forEach(key => {
          const anmationData = this.queue[+key]
          const { x, y } = this.updatePath(
            anmationData.pathData,
            anmationData.factor,
          )
          const { speed } = anmationData.factor
          anmationData.factor.t += speed
          let curWidth = this.iconWidth
          curWidth = (330 - y) / 1.5
          curWidth = Math.min(40, curWidth)
          this.ctx.globalAlpha = 1 - anmationData.factor.t
          this.ctx.drawImage(
            anmationData.image,
            x - curWidth / 2,
            y,
            curWidth,
            curWidth,
          )
          // 贝塞尔曲线系数大于1，删除该气泡
          if (anmationData.factor.t > 1) {
            delete this.queue[anmationData.id]
          }
          if (y < 150) {
            delete this.queue[anmationData.id]
          }
        })
        if (Object.keys(this.queue).length > 0) {
          //每20ms刷新一次图层
          // this.timer = setTimeout(() => {
          //   this.bubbleAnimate()
          //   // this.ctx.clearRect(0, 0, 90, 400)
          //
          // }, 20)
          this.timer = window.requestAnimationFrame(this.bubbleAnimate)
        } else {
          //clearTimeout(this.timer)
          cancelAnimationFrame(this.timer)
          this.ctx.clearRect(0, 0, 90, 400)
          // setTimeout(()=>{
          //   this.ctx.clearRect(0, 0, 90, 400)
          // },10)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  #bubble {
    width 90px
    height 300px
  }

  .canvas-box {
    position absolute
    right 0
    bottom 80px
    z-index 199

  }

  .live-like {
    /*position absolute*/
    /*right 0*/
    /*bottom 0*/
    /*z-index 200*/
  }

  .like-box {
    position: absolute;
    bottom 420px
    right 80px
  }

  .like-icon {
    display block
    width 32px

  }

  .like-img {
    /*cursor pointer*/
    display block
    width 40px
    height 40px
    position absolute
    right 25px
    bottom 30px
  }
</style>
