export default{
    totalCount(state){
        // 0是传入函数的preTotal的初始值，计算总数，用在红色提示上
        return state.shopCart.reduce((preTotal,food)=>{
            return preTotal+food.count
        },0)
    },
    totalPrice(state){
        // 0是传入函数的preTotal的初始值,计算总价
        return state.shopCart.reduce((prePrice,food)=>{
            return prePrice+food.price*food.count
        },0)
    }
}