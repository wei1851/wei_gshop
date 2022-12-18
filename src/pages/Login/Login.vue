<template>
  <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">短信登录</a>
            <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <!-- 阻止表单登录的事件默认行为 -->
          <form @submit.prevent="login">
            <div :class="{on:!loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <!-- disabled属性控制input样式的可不可点击。输入正确的手机号码后应该显示为可点击状态 -->
                <button :disabled="!rightPhone" class="get_verification"
                :class="{right_phone:rightPhone}" @click.prevent="getCode">
                {{computeTime > 0 ? computeTime + 'S' : '获取验证码'}}</button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:loginWay}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <!-- 用text和password表单来实现密码显示隐藏的效果，password表单有隐藏密码的功能 -->
                  <input type="tel" maxlength="8" placeholder="密码" v-model="pwd" v-if="showPassword">
                  <input type="password" maxlength="8" placeholder="密码" v-model="pwd" v-if="!showPassword">
                  <div class="switch_button " :class="showPassword?'on':'off'" @click="showPassword=!showPassword">
                    <div class="switch_circle" :class="{right: showPassword}"></div>
                    <span class="switch_text">{{showPassword ? 'abc' : '...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <!-- 点击刷新验证码，ref实现标记功能 -->
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha"
                  @click="getCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <!-- 传props参数记得加：号，给AlertTip组件绑定closeTip事件 -->
      <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"/>
    </section>
</template>

<script>
import { computed } from 'vue'
import {reqMsgCaptcha, reqSmsLogin,reqPwdLogin} from '../../api'
import AlertTip from '../../components/AlertTip/AlertTip.vue'
export default {
  data(){
    return {
      loginWay: true, // true 代表密码登陆, false 代表短信登录
      phone:'',//手机号,与输入的手机号双向绑定
      computeTime:0,
      // 用来接收输入的账号密码和验证码
      code:'',//短信验证码
      name:'',//账号
      pwd:'',//密码
      captcha:'',//图形验证码
      showPassword:false,//显示密码
      showAlert: false, // 是否显示提示框
      alertText: '', // 提示框文本
    }
  },

  computed:{
    rightPhone(){
      // 使用正则表达式检验输入的手机号是否符合格式，\d表示0-9任意数字，^1表示1开头，{10}表示前面的内容出现10次，$表示结束
      return /^1\d{10}$/.test(this.phone)
    },
  },

  mounted(){
    // 初始化账号密码
    this.name = ''
    this.pwd = ''
  },

  methods:{
    async getCode(){
      // 如果在倒计时就不能点击开启多个定时器和发送验证码
      if(this.computeTime === 0){
        this.computeTime=60
        this.Timer = setInterval(() =>{
          this.computeTime--
          //如果到时, 停止计时
          if (this.computeTime === 0) {
          clearInterval(this.intervalId)
          }
        },1000)

        // 发送 ajax 请求(请求后台向指定手机号发验证码短信)，后台返回请求是否接收到的结果
        let result = await reqMsgCaptcha(this.phone)
        //判断后台是否接收到，接收失败返回"code": 1,
        if (result.code === 1) {
          // 显示提示框
          this.showAlert = true
          this.alertText = result.msg
          // 停止倒计时
          if(this.computeTime) {
            this.computeTime = 0
            clearInterval(this.intervalId)
          }
        }
      }
    },

    // 获取图形验证码
    getCaptcha() {
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
    },

    // 关闭提示框
    closeTip () {
      this.showAlert = false
      this.alertText = ''
    },

    // 发送登录信息
    async login() {
      // debugger
      if (!this.loginWay) {
        // 如果是短信登录，判断手机号码格式对不对，判断短信格式对不对
        if (!this.rightPhone) {
          this.showAlert = true;
          this.alertText = '手机号码不正确'
          return
        } else if (!(/^\d{6}$/gi.test(this.code))) {
          this.showAlert = true;
          this.alertText = '验证必须是6位数字'
          return
        }

        // 向后台发送登录手机号登录请求
        const result = await reqSmsLogin(this.phone,this.code)
        // 如果返回结果正确，则获取用户数据
        if(result.code === 0){
          this.userInfo = result.data
        }else{
          this.userInfo = {
            msg: '登陆失败, 手机号或验证不正确'
          }
        }
      }else{
        // 账号密码和验证码登录
        // 先判断有没有输这三个
        if(!this.name){
          this.showAlert = true
          this.alertText = '请输入手机号/邮箱/用户名'
          return
        }else if(!this.pwd){
          this.showAlert = true
          this.alertText = '请输入密码'
          return
        }else if(!this.captcha){
          this.showAlert = true
          this.alertText = '请输入验证码'
          return
        }

        const result = await reqPwdLogin(this.name,this.pwd,this.captcha)
        if (result.code === 0) {
          this.userInfo = result.data
        } else {
          this.userInfo = {
            msg: result.msg
          }
        }
        
      }
      //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
      if (!this.userInfo._id) {
        this.showAlert = true
        this.alertText = this.userInfo.msg
        // 重置图形验证码
        if (!this.loginWay) {
          this.getCaptcha()
        }
      } else {
          this.$store.dispatch('recordUserInfo', this.userInfo)
          this.$router.back()
      }
    }
  },

  components: {
    AlertTip
  },
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixins.styl'
    .loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                   color: black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                     transform translateX(30px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>