// 包含n个接口请求函数的模块

// 引入ajax请求函数,函数的返回值：promise对象
import ajax from "./ajax";

// 1、根据经纬度获取位置详情
// 传入geohash参数，请求的url地址后面是params参数，所以用拼串的方式将geohash拼入地址
export const reqAddress = (geohash) => ajax(`/api/position/${geohash}`)

// 2、获取食品分类列表
export const reqCategorys = () => ajax('/api/index_category')

// 3、根据经纬度获取商铺列表
/*
传入latitude,longtitude参数，请求的url地址后面是query参数,所以将latitude,longtitude参数传入，
传入的参数名和需要的属性名相同，使用对象的简写形式即latitude：latitude简写为latitude
*/
export const reqShops = (latitude,longtitude) => ajax('/api/shops',{latitude,longtitude})

// 4、根据经纬度和关键字搜索商铺列表
export const reqSearchShops = (geohash,keyword) => ajax('/api/search_shops',{geohash,keyword})

// 5、获取一次性验证码
export const reqCaptcha = () => ajax('/api/captcha')

// 6、用户名密码登陆
export const reqPwdLogin = (name,pwd,captcha) => ajax('/api/login_pwd',{name,pwd,captcha},'POST')

// 7、请求短信验证码
export const reqMsgCaptcha =(phone) => ajax('/api/sendcode',{phone})

// 8、手机号验证码登陆
export const reqSmsLogin = (phone,code) => ajax('/api/login_sms',{phone,code},'POST')

// 9、根据会话获取用户信息
export const reqUserInfo = () => ajax('/api/userinfo')

// 10、用户登出
export const reqLogout = () => ajax('/api/logout')

/**
* 获取商家信息
*/
export const reqShopInfo = () => ajax('/info')
/**
* 获取商家评价数组
*/
export const reqShopRatings = () => ajax('/ratings')
/**
* 获取商家商品数组
*/
export const reqShopGoods = () => ajax('/goods')