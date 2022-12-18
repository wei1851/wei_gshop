<template>
    <div class="cartcontrol">
        <!-- 给减号添加滚动动画 -->
        <transition name="move">
            <div class="iconfont icon-remove_circle_outline" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
        </transition>
        <div class="cart-count" v-if="food.count">{{food.count}}</div>
        <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
    </div>
</template>

<script>
export default {
    // CartControl是对不同的食物的订单个数进行操作，所以每个食物都有对应的CartControl,将food作为参数传入
    props:{
        // 对象形式，指定接收参数的类型
        food:Object
    },
   methods:{
    // 实现一个功能，点击的时候个数会增加，并且将数据记录起来，每个食物对应相应的个数
    // 在state里设计一个属性，包含food和food的count属性
    // 在点餐的时候才记录点的东西，可以把每个食物的记录准确的传入state中，既实现了按需引入，又能涉及到所有的食物
    updateFoodCount(isAdd){
        const {food} =this
        this.$store.dispatch('updateFoodCount',{food,isAdd})
    }
   }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
     @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
        // 动画的样式
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(15px) rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>