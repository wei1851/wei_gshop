<template>
  <div class="msite">
    <!--首页头部-->
    <HeadTop :title="address.name">
      <!-- 将两个有路由跳转链功能的部分放到对应插槽里 -->
      <router-link slot="search" to="/search" class="header_search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <!-- 有用户信息就跳转到用户界面，没有就跳转到登录界面 -->
      <router-link slot="login" :to="userInfo._id?'/profile':'/login'" class="header_login">
        <!-- 有用户信息就显示人头，没有就显示登录注册 -->
        <span v-if="!userInfo._id" class="header_login_text">登录|注册</span>
        <span v-else class="header_login_text"><i class="iconfont icon-person"></i></span>
      </router-link>
    </HeadTop>
    <div class="miste-content-wrapper">
      <div class="miste-content" ref="content">
        <!--首页导航-->
        <nav class="msite_nav">
          <!-- 有categorysArr再创建导航 -->
          <div class="swiper-container" v-if="categorysArr.length">
            <div class="swiper-wrapper">
              <!-- 遍历两层，第一层将包含8个数据的数组遍历出来，第二层将数组的元素遍历出来 -->
              <div class="swiper-slide" v-for="(cs,index) in categorysArr" :key="index">
                <a href="javascript:" class="link_to_food" v-for="(c,index) in cs" :key="index">
                  <div class="food_container">
                    <img :src="imgBaseUrl+c.image_url">
                  </div>
                  <span>{{c.title}}</span>
                </a>
              </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
          </div>
          <!-- 网速慢的时候显示灰色背景 -->
          <img src="./images/msite_back.svg" alt="back" v-else>
        </nav>
        <!--首页附近商家-->
        <div class="msite_shop_list">
          <div class="shop_header">
            <i class="iconfont icon-xuanxiang"></i>
            <span class="shop_header_title">附近商家</span>
          </div>
          <ShopList/>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
// 引入Swiper工具
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import HeadTop from '../../components/HeadTop/HeadTop.vue'
import ShopList from '../../components/ShopList/ShopList.vue'
import BScroll from 'better-scroll'
// 从vuex中引入mapState方法，必须
import {mapState} from 'vuex'

export default {

    data(){
      return{
        imgBaseUrl:'https://fuss10.elemecdn.com'
      }
    },

    // 创建组件后获取数据
    mounted(){
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')
    },

    computed:{
      // 映射state中的数据为计算属性
      ...mapState(['address','categorys','userInfo']),

      // 定义新计算属性，用来给获取的数组分类
      categorysArr(){
        const max = 8
        const arr = []
        // 变量的解构赋值，将this中的catogorys属性和值赋给{categorys}
        const {categorys} = this
        // 定义一个中间变量数组，用来接收分类好的数据
        let smallArr = []
        // 返回的categorys是数组,遍历数组并重新分成新的二维数组，二维数组的元素是个数为8的一维数组
        categorys.forEach((c,index) => {

          //采用数组的push方法将数据存入临时数组内
            smallArr.push(c)
            // 如果临时数组满了，将数组放入大数组arr中,并重新创建smallArr
            if((smallArr.length)%max === 0 && smallArr.length!==0){
              arr.push(smallArr)
              smallArr = []
            }

        });

        return arr
      }
    },
    methods:{
      setContentMarginTop(){
        const content = this.$refs.content
        content.style.marginTop = 20 + 'px'
      }
    },

    // 监视categorys属性的变化，如果有变化则重新生成导航轮播图
    watch:{
      categorys(value){
        // 使用nextTick方法，在页面渲染的时候重新创建Swiper对象
        this.$nextTick(() =>{
          new Swiper('.swiper-container', {
              pagination: {
              el: '.swiper-pagination',
              },
              loop: true
          })

          this.scroll=new BScroll('.miste-content-wrapper', {
            click: true,
          })
        })
      }
    },

    components:{
      HeadTop,ShopList
    },
    
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .miste-content-wrapper
      position fixed
      top: 45px
      bottom: 46px
      width: 100%
      .msite_nav
        bottom-border-1px(#e4e4e4)
        margin-top 15px
        height 200px
        background #fff
        .swiper-container
          width 100%
          height 100%
          .swiper-wrapper
            width 100%
            height 100%
            .swiper-slide
              display flex
              justify-content center
              align-items flex-start
              flex-wrap wrap
              .link_to_food
                width 25%
                .food_container
                  display block
                  width 100%
                  text-align center
                  padding-bottom 10px
                  font-size 0
                  img
                    display inline-block
                    width 50px
                    height 50px
                span
                  display block
                  width 100%
                  text-align center
                  font-size 13px
                  color #666
          .swiper-pagination
            >span.swiper-pagination-bullet-active
              background #02a774
      .msite_shop_list
        top-border-1px(#e4e4e4)
        margin-top 10px
        background #fff
        .shop_header
          padding 10px 10px 0
          .shop_icon
            margin-left 5px
            color #999
          .shop_header_title
            color #999
            font-size 14px
            line-height 20px
</style>