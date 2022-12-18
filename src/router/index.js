import Vue from 'vue'
import VueRouter from 'vue-router'

// import Order from '../pages/Order/Order.vue'
// import Profile from '../pages/Profile/Profile.vue'
// import Msite from '../pages/Msite/Msite.vue'
// import Search from '../pages/Search/Search.vue'
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings'

// 路由组件懒加载
const Order = () => import('../pages/Order/Order.vue')
const Profile = () => import('../pages/Profile/Profile.vue')
const Msite = () => import('../pages/Msite/Msite.vue')
const Search = () => import('../pages/Search/Search.vue')

Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            path:'/',
            // 在首页根目录直接跳转到Msite路由页面显示
            redirect:'/msite'
        },
        {
            path:'/msite',
            component:Msite,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/order',
            component:Order,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/profile',
            component:Profile,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/search',
            component:Search,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/login',
            component:Login
            
        },
        {
            path:'/shop',
            component:Shop,
            children:[
                {
                    path:'',
                    // 在首页根目录直接跳转到Msite路由页面显示
                    redirect:'/shop/goods'
                },
                {
                    path:'/shop/goods',
                    component:ShopGoods
                },
                {
                    path:'/shop/info',
                    component:ShopInfo
                },
                {
                    path:'/shop/ratings',
                    component:ShopRatings
                }
            ]
        }
    ]
})