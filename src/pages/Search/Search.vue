<template>
    <!--搜索-->
    <section class="search">
      <HeadTop title='搜索'/>
      <form class="search_form">
        <input type="search" placeholder="请输入商家名称" class="search_input" v-model="keyword">
        <input type="submit" class="search_submit" @click.prevent="search">
      </form>
      <div class="search-wrapper">
        <div class="list">
          <ul class="list_container">
            <router-link :to="{path:'/shop', query:{id:shop.id}}" tag="li" class="list_li" v-for="(shop) in searchShops" :key="shop.id" >
              <section class="item_left">
                <img :src="baseUrl+shop.image_path" class="restaurant_img">
              </section>
              <section class="item_right">
                <div class="item_right_text">
                <p>
                <span>{{shop.name}}</span>
                </p>
                <p>月售{{shop.recent_order_num}}单</p>
                <p>{{shop.float_minimum_order_amount}}元起送 / 距离{{shop.distance}}</p>
                </div>
              </section>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    </section>
</template>

<script>
import HeadTop from '../../components/HeadTop/HeadTop.vue'
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
export default {
  data(){
    return {
      keyword:'',
      baseUrl:'http://cangdu.org:8001/img/',
      emptyResult:false
    }
  },
  components:{
      HeadTop
  },
  computed:{
    ...mapState(['searchShops'])
  },
  methods:{
    search(){
      const keyword = this.keyword.trim()
      if(keyword){
        this.emptyResult=false
        this.$store.dispatch('getSearchShops',keyword)
      }
    }
  },

  // 监视searchShops的长度，如果没有数据，则显示为空
  watch:{
    searchShops(val){
      if(!val.length){
        this.emptyResult=true
      }
      this.$nextTick(() => {
          new BScroll('.search-wrapper',{})
      })
    }
  },
  mounted(){
    new BScroll('.search-wrapper',{})
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774
    .search-wrapper
      width 100%
      height 513px
      overflow hidden
      .list
        .list_container
          background-color: #fff;
          .list_li
            display: flex;
            justify-content: center;
            padding: 10px
            border-bottom: 1px solid $bc;
            .item_left
              margin-right: 10px
              .restaurant_img
                width 50px
                height 50px
                display block
            .item_right
              font-size 12px
              flex 1
              .item_right_text
                p
                  line-height 12px
                  margin-bottom 6px
                  &:last-child
                    margin-bottom 0
      .search_none
        margin: 0 auto
        color: #333
        background-color: #fff
        text-align: center
        margin-top: 0.125rem
</style>