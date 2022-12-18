<template>
    <div>
       <button @click="isShow=!isShow">显示/隐藏</button>
       <transition name="hello">
            <h1 v-show="!isShow">你好啊！</h1>
       </transition>
    </div>
</template>
<script type="text/javascript">
export default {
    name:'Test',
    data() {
        return {
          isShow:true
        }
    },
}
</script>

<style lang="" scoped>
    h1{
        background-color: orange;
    }
    .hello-enter,.hello-leave-to{
        transform: translateX(-100%);
    }
    .hello-enter-active,.hello-leave-active{
        transition:all 3s ;
    }
</style>