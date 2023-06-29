<template>
  <!-- <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view> -->

  <div id="nav">
    <router-link class="tab-bar-item" to="/home">
      <div class="icon"><i class="iconfont icon-shouye"></i></div>
      <div>首页</div>
    </router-link> 
    <router-link class="tab-bar-item" to="/category">
      <div class="icon"><i class="iconfont icon-fenlei"></i></div>
      <div>分类</div>
    </router-link> 
    <router-link class="tab-bar-item" to="/shopcart">
      <div class="icon">
        <van-badge :content="store.state.cartCount" max="50">
          <i class="iconfont icon-gouwuchezhengpin"></i>
        </van-badge>
      </div>
      <div>购物车</div>
    </router-link> 
    <router-link class="tab-bar-item" to="/profile">
      <div class="icon"><i class="iconfont icon-yonghu"></i></div>
      <div>我的</div>
    </router-link> 
  </div>
  <router-view/>
</template>

<script lang="ts">
// 接口说明文档：https://www.showdoc.com.cn/1207745568269674/6094279351627422
// 测试邮箱：1509373762@qq.com   123456
// 测试邮箱：panpan_smile@outlook.com   panpan
import { defineComponent,onMounted,watchEffect} from 'vue';
import {useStore} from 'vuex';
export default defineComponent({
  name: 'App',
  components: {

  },
  setup(){
    let store=useStore();
    onMounted(()=>{
      // 避免每次刷新页面时购物车上的数量图标都置0
      store.dispatch('updateCartCount')
    })
    return{
      store
    }
  }
});
</script>


<style lang="scss">
@import url('../src/assets/css/base.css');
@import url('../src/assets/css/iconfont.css');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  // padding: 30px;
  width: 100%;
  display: flex;
  position: fixed;
  background-color: #F6F6F6;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 3px rgba(100,100,100,0.1);
  z-index: 15;

  a {
    color: var(--color-text);


    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 50px;
    font-size: var(--font-size);
  }

  .tab-bar-item .icon{
    width: 24px;
    height: 24px;
    margin-top: 5px;
    vertical-align: middle;
    display: inline-block;
  }
}

</style>
