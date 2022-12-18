/*
vuex 的 actions 模块
*/

import {reqAddress, reqCategorys, reqShops, reqUserInfo,reqLogout,reqShopInfo,reqShopRatings,reqShopGoods, reqSearchShops} from '../api'
import {RECEIVE_ADDRESS, RECEIVE_CATEGORYS, RECEIVE_SHOPS,RECEIVE_USER_INFO,RESET_USER_INFO,RECEIVE_INFO,RECEIVE_RATINGS,RECEIVE_GOODS,INCREMENT_FOOD_COUNT,DECREMENT_FOOD_COUNT,CLEAR_SHOP_CART,RECEIVE_SEARCH_SHOPS} from './mutation-types'

export default {

    // 异步获取地址
    // 传入commit和state作为上下文
    async getAddress({commit, state}) {
        // 拼接经纬度
        const geohash = state.latitude + ',' + state.longtitude
        // 异步获取ajax请求返回的数据
        const result = await reqAddress(geohash)
        // 将需要触发的mutation方法名和传输的数据传给mutation
        commit(RECEIVE_ADDRESS, {address: result.data})
    },

    // 异步获取分类列表
    // 用到state的时候再传入
    async getCategorys({commit}) {
        const result = await reqCategorys()
        commit(RECEIVE_CATEGORYS, {categorys: result.data})
    },

    // 异步获取商家列表
    async getShops({commit, state}) {
        const {latitude, longitude} = state
        const result = await reqShops({latitude, longitude})
        commit(RECEIVE_SHOPS, {shops: result.data})
    },

    // 记录用户信息
    recordUserInfo({commit},userInfo){
        commit(RECEIVE_USER_INFO,{userInfo})
    },
            
    // 异步获取用户信息
    async getUserInfo({commit}){
        const result = await reqUserInfo()
        // 获取成功的时候才保存
        if(result.code === 0){
            commit(RECEIVE_USER_INFO,{userInfo:result.data})
        }
    },

    // 登出
    async logout({commit}){
        const result = await reqLogout()
        // 登出成功的时候才重置
        if(result.code === 0){
            commit(RESET_USER_INFO)
        }
    },

    // 异步获取商家信息
    async getShopInfo({commit}) {
        const result = await reqShopInfo()
        if(result.code===0) {
            const info = result.data
            commit(RECEIVE_INFO, {info})
        }
    },


    // 异步获取商家评价列表
    async getShopRatings({commit}, cb) {
        const result = await reqShopRatings()
        if(result.code===0) {
            const ratings = result.data
            commit(RECEIVE_RATINGS, {ratings})
            cb && cb()
        }
    },

    // 异步获取商家商品列表
    async getShopGoods({commit}, cb) {
        const result = await reqShopGoods()
        if(result.code===0) {
            const goods = result.data
            commit(RECEIVE_GOODS, {goods})
            // 如果组件中传递了接收消息的回调函数, 数据更新后, 调用回调通知调用的组件
            cb && cb()
        }
    },

    updateFoodCount({commit},{food,isAdd}){
       if(isAdd){
        // 增加
        commit(INCREMENT_FOOD_COUNT,{food})
       }else{
        // 减少
        commit(DECREMENT_FOOD_COUNT,{food})
       }
    },

    clearShopCart({commit}){
        commit(CLEAR_SHOP_CART)
    },

    async getSearchShops({commit,state},keyword){
        const {latitude,longtitude} = state
        const geohash = latitude + ',' + longtitude
        const result = await reqSearchShops(geohash,keyword)
        if(result.code === 0){
            commit(RECEIVE_SEARCH_SHOPS,{searchShops:result.data})
        }
    }
}