<template>
    <div class="nav-bar">
        <div class="left" @click="goback"><slot name="left"></slot>
            <img src="@/assets/images/left.png" alt="">
        </div>
        <div class="center"><slot>EWShop</slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useRouter} from 'vue-router';
export default defineComponent({
    name:'NavBar',

    setup(){
        const router=useRouter();

        const goback=()=>{
            router.go(-1);
        }

        return{
            goback,
        }

    }
})
</script>

<style lang='scss'>
.nav-bar{
    display: flex;
    background-color: var(--color-tint);
    color: #FFFFFF;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 10;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: 0 2px 1px rgba(100,100,100,0.1);
}

.left, .right{
    width: 60px;
}

.left img{
    width: 45px;
    padding: 12px;
}
.center{
    flex: 1;
}
</style>