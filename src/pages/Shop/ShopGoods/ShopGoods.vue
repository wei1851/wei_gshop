<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li class="menu-item" :class="{current:index===currentIndex}" @click="changeCurrentIndex(index)" v-for="(g,index) in goods" :key="index">
                        <span class="text bottom-border-1px">
                            <img class="icon" :src="g.icon" v-if="g.icon">
                            {{g.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul ref="foodsUl">
                    <li class="food-list-hook"  v-for="(g,index) in goods" :key="index">
                        <h1 class="title">{{g.name}}</h1>
                        <ul>        
                            <li class="food-item bottom-border-1px" v-for="(food,index) in g.foods" :key="index" @click="showFood(food)">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率 {{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <CartControl :food='food'/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- 这个组件放在goods里比较合适，切换路由的时候不会继续显示 -->
            <ShopCart :food='food'/>
        </div>
        <Food :food="food" ref="food"/>
    </div>
</template>

<script>
// 在使用better-scroll的组件引入即可
import BScroll from 'better-scroll'

import {mapState} from 'vuex'

import CartControl from '../../../components/CartControl/CartControl.vue'
import Food from '../../../components/Food/Food.vue'
import ShopCart from '../../../components/ShopCart/ShopCart.vue'
export default {
    data(){
      return {
        tops:[],
        scrollY:0,//用来接收右侧列表滚动的距离
        /**food在这里定义有几个用处：
         * 1.传给CartControl组件，防止在该组件依赖的food数据从ajax请求获取太慢，获取不到，报undefined的错误
         * 2.传给Food组件，原理同上
         * 3.指定Food组件需要展示的食物大图，避免了给每个食物都定义一个Food组件，实现按需展示
         */
        food:{},
      }
    },

    components:{CartControl,ShopCart,Food},

    mounted(){
        this.$store.dispatch('getShopGoods',()=>{
          // 在获取到ajax数据后的回调函数使用，确保nextTick在DOM更新后执行
          this.$nextTick(() =>{
            this._initScroll()
            this.getHeight()
          })
        })
    },

    computed:{
        ...mapState(['goods']),
        // 计算得到当前分类的下标
        currentIndex() {// 初始和相关数据发生了变化
          // 得到条件数据
          const {scrollY, tops} = this
          // 根据条件计算产生一个结果
          const index = tops.findIndex((top, index) => {
            // scrollY>=当前top && scrollY<下一个top
            return scrollY >= top && scrollY < tops[index + 1]
          })
          // 返回结果
          return index
        }
    },
  
   

    methods:{
      /*实现效果：
      1.点击左侧菜单栏后右侧对应食物栏分类的类名置顶
      2.右侧食物栏移动左侧菜单栏随着变化
      */

     
     getHeight(){
      // 获取生成的菜单项
      const li = this.$refs.foodsUl.getElementsByClassName('food-list-hook')

      // 上面获取到的是伪数组，将伪数组变成真数组
      const list = Array.prototype.slice.call(li)

      // 将初始高度设置为0，用来表示初始元素顶部距离父元素的高度
      let top=0
      this.tops.push(top)
      // 获取每个元素的高度并保存起来
      list.forEach((item,index) =>{
        // clientHeight保存的只是元素不包含margin的高度，不是距离任意事物的距离，获取的高度对应下一个元素的顶部高度
        top += item.clientHeight
        this.tops.push(top)
      })
     },

     _initScroll(){
        // 左侧分类列表的 BScroll
        new BScroll('.menu-wrapper',{
          click: true //响应点击
        })
        
        // 右侧 food 列表的 BScroll,定义在滚动元素的包裹元素上
        this.foodsScroll = new BScroll('.foods-wrapper',{
          probeType: 2, // 手指滑动(惯性滑动和编码滑动不监视)
          click: true, //响应点击
        })

        // 给右侧列表绑定scroll结束的监听
        this.foodsScroll.on('scrollEnd', ({x, y}) => {
          console.log('scrollEnd', x, y)
          this.scrollY = Math.abs(y)
        })
      },


    /*
    实现第一个功能：
    1.实现点击菜单栏对应高亮效果
    给每个菜单栏都添加点击事件，声明一个变量，点击的时候变量会变为当前的元素的值。
    */
    //  click事件可以接受到每个元素的index，将其作为实参传入
     changeCurrentIndex(index){
        // 使用右侧列表滑动到对应的位置

        // 得到目标位置的scrollY
        const scrollY = this.tops[index]
        // 立即更新scrollY(让点击的分类项成为当前分类)
        this.scrollY = scrollY
        // 平滑滑动右侧列表
        this.foodsScroll.scrollTo(0, -scrollY, 300)
     },

     // 显示点击的food
    showFood (food) {
      // 设置food
      this.food = food
      // 显示food组件 (在父组件中调用子组件对象的方法)
      this.$refs.food.toggleShow()
    }

    }

}

</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>