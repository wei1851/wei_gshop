/*
vuex 的 mutations 模块
*/
import Vue from 'vue'
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEAR_SHOP_CART,
    RECEIVE_SEARCH_SHOPS
} from './mutation-types'
    
export default {

    // 接收地址信息并传给state管理
    [RECEIVE_ADDRESS](state, {address}) {
        state.address = address
    },

    // 接收分类数组并传给state管理
    [RECEIVE_CATEGORYS](state, {categorys}) {
        state.categorys = categorys
    },

     // 接收商家数组并传给state管理
    [RECEIVE_SHOPS](state, {shops}) {
        state.shops = shops
    },

     // 接收用户信息并传给state管理
     [RECEIVE_USER_INFO](state, {userInfo}) {
        state.userInfo = userInfo
    },

     // 重置state保存的用户信息,在这里传入userInfo形参会导致错误
     [RESET_USER_INFO](state) {
        state.userInfo = {}
    },

    [RECEIVE_INFO](state, {info}) {
        state.info = info
    },

    [RECEIVE_RATINGS](state, {ratings}) {
        state.ratings = ratings
    },

    [RECEIVE_GOODS](state, {goods}) {
        state.goods = goods
    },

    [INCREMENT_FOOD_COUNT](state,{food}){
        // 先判断food有没有count属性，没有就加上
        if(!food.count){// 第一次增加时, 没有 count
            // food.count = 1  // 新增属性(没有数据绑定)
            /*
            对象
            属性名
            属性值
            */
            // 问题: 新添加的属性没有数据劫持==>数据绑定==>更新了数据但界面不变
            Vue.set(food,'count',1)//给有数据绑定的对象添加指定属性名和值的属性(有数据绑定)
            // 添加进state中保存food的属性
            state.shopCart.push(food)
            console.log('1')
        }else{
            food.count++
        }       
    },

    [DECREMENT_FOOD_COUNT](state,{food}){
        if(food.count){//有food.count才减,防止有连续多次点击还能减少的bug
            food.count--
            if(food.count===0){// 如果数量减为 0, 从购物车中移除
                state.shopCart.splice(state.shopCart.indexOf(food), 1)
            }
        }
    },
    [CLEAR_SHOP_CART](state){
        // 将所有food的count置为0，让goods里的food同步更新
        state.shopCart.forEach((food,index)=>{
            //对count属性使用数据绑定之后，使用.号调用属性修改的方式也能被监测到
            food.count = 0
        })
        state.shopCart = []
    },

    [RECEIVE_SEARCH_SHOPS](state,{searchShops}){
        state.searchShops = searchShops
    }

}