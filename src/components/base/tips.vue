<template>
<div>
    <div class="tips-box" v-if="tips.status">
        <div class="tips-container">
            <p class="tips-title">{{tips.title}}</p>
            <slot>
                <p class="tips-text">{{tips.content }}</p>
            </slot>
            <el-divider></el-divider>
            <p class="close-btn" @click="close">我知道了</p>
        </div>

    </div>
</div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'tips',
    data() {
      return {

      }
    },
    created() {
    },
    computed: {
      ...mapState({
        tips: state => state.tips,
      }),
    },
    methods: {
      close() {
        this.$store.commit('showTips', { status: false })
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .tips-box{
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        background-color rgba(0,0,0,0.46)
        display flex
        justify-content center
        align-items center
        z-index 999
        .tips-container{
            background-color #ffffff
            padding 10px 15px
            line-height 26px
            text-align center
            min-width 150px
            .tips-title{
                /*text-align left*/
                color #000
                font-size 14px
            }
            .tips-text{
                font-size 12px
                color #6a6a6a

            }
            .close-btn{
                margin-top 10px
                font-size 14px
                color #409EFF
            }
        }

    }

</style>
