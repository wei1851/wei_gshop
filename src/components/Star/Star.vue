<template>
    <!-- 要拼串的字符串要用``包起来 -->
  <div class="star" :class="`star-${size}`">
    <span class="star-item" v-for="(type,index) in starClassArr" :key="index" :class="type"></span>
  </div>
</template>

<script>
import { computed } from 'vue'
import {mapState} from 'vuex'

// 在export外定义常量,语句后面不能加标点
const CLASS_ON = 'on'
const CLASS_OFF = 'off'
const CLASS_HALF = 'half'

export default {
    // 使用props接收数据，使用对象的形式，规定数据的类型
    props: {
        score: Number,
        size: Number
    },
    computed:{
        starClassArr(){
            const scs = []
            /*
            3.4: 3 + 0 + 2
            3.5: 3 + 1 + 1
            starClasses: []
            */
            const {score} = this
            const scoreInteger = Math.floor(score)
            for(let i=0;i<scoreInteger;i++){
                scs.push(CLASS_ON)
            }
            // javascript运算小数可能有错误，放大计算
            if(score*10-scoreInteger*10>=5){
                scs.push(CLASS_HALF)
            }
            if(scs.length<5){
                scs.push(CLASS_OFF)
            }

            return scs
        }
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixins.styl'
    .star //2x图 3x图
     float left
     font-size 0
     .star-item
      display inline-block
      background-repeat no-repeat
     &.star-48
      .star-item
       width 20px
       height 20px
       margin-right 22px
       background-size 20px 20px
       &:last-child
        margin-right: 0
       &.on
        // 变量路径都是从mixins样式表开始查找，疑点
        bg-image('./images/stars/star48_on')
       &.half
        bg-image('./images/stars/star48_half')
       &.off
        bg-image('./images/stars/star48_off')
     &.star-36
      .star-item
       width 15px
       height 15px
       margin-right 6px
       background-size 15px 15px
       &:last-child
        margin-right 0
       &.on
        bg-image('./images/stars/star36_on')
       &.half
        bg-image('./images/stars/star36_half')
       &.off
        bg-image('./images/stars/star36_off')
     &.star-24
      .star-item
       width 10px
       height 10px
       margin-right 3px
       background-size 10px 10px
       &:last-child
        margin-right 0
       &.on
        bg-image('./images/stars/star24_on')
       &.half
        bg-image('./images/stars/star24_half')
       &.off
        bg-image('./images/stars/star24_off')
</style>