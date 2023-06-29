<template>
  <div id="home">
    <NavBar>
      <template v-slot>图书兄弟</template>
    </NavBar>

    <TabControl v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>

    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <HomeSwiper :banners="banners"></HomeSwiper>
          <RecommendView :recommends="recommends"></RecommendView>
        </div>

        <TabControl @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>

        <GoodsList  :goods="showGoods"></GoodsList>
      </div>
    </div>

    <BackTop @bTop="bTop" v-show="isTabFixed"></BackTop>
  </div>
</template>

<script>
import { defineComponent,onMounted,reactive,ref ,computed,watchEffect,nextTick} from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import RecommendView from '@/views/home/ChildComps/RecommendView.vue';
import TabControl from '@/components/content/tabControl/TabControl.vue';
import GoodsList from '@/components/content/goods/GoodsList.vue';
import BackTop from '@/components/common/backtop/BackTop.vue';
import HomeSwiper from '@/views/home/ChildComps/HomeSwiper.vue';
import { getHomeAllData,getHomeGoods } from '@/network/home';
import BScroll from 'better-scroll';


export default defineComponent({
  name:'Home',
  components:{
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
    BackTop,
    HomeSwiper
  },

  setup(){
    let isTabFixed=ref(false);
    let banref=ref();

    const recommends=ref([]);
    
    let bscroll=reactive({});

    let banners=ref([]);

    let currentType=ref('sales');

    // 商品列表数据模型
    const goods=reactive({
      sales:{page:1,list:[]},
      new:{page:1,list:[]},
      recommend:{page:1,list:[]},
    })

    const showGoods=computed(()=>{
      return goods[currentType.value].list
    })


    const tabClick=(index)=>{
      let types=['sales','new','recommend'];
      currentType.value=types[index]
      nextTick(()=>{
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    }

    const bTop=()=>{
      // 回到顶部的滚动方法：scrollTo()
      bscroll.scrollTo(0,0,300);
    }

    onMounted(()=>{
      getHomeAllData().then((res) => {
        recommends.value=res.goods.data;
        banners.value=res.slides;
      })

      getHomeGoods('sales').then(res=>{
        goods.sales.list=res.goods.data
      })

      getHomeGoods('recommend').then(res=>{
        goods.recommend.list=res.goods.data
      })

      getHomeGoods('new').then(res=>{
        goods.new.list=res.goods.data
      })

      // 上拉加载更多
      // 创建BeeterScrool对象
      bscroll = new BScroll(document.querySelector('.wrapper'),{
        probeType: 3,  // 0,1,2,3  3就是只要在运行时就出发scroll事件
        click: true,  // 是否允许点击
        pullUpLoad: true  // 上啦加载更多，默认是false
      })
      // 触发滚动事件
      bscroll.on('scroll',(position) => {
        isTabFixed.value = (-position.y) > (banref.value.offsetHeight);       
      })
      // 上拉加载数据，触发pullingup
      bscroll.on("pullingUp",() => {
        const page = goods[currentType.value].page + 1;
        getHomeGoods(currentType.value,page).then(res => {
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page += 1;
        })
        // 完成上拉，等数据请求完成，要将新数据展示出来
        bscroll.finishPullUp();
        // 重新计算高度
        bscroll.refresh();
      })

    })

    // 监听任何变量
    watchEffect(()=>{
      nextTick(()=>{
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    })

    return{
      recommends,
      goods,
      showGoods,
      tabClick,
      isTabFixed,
      bTop,
      banref,
      banners,
    }
  }
})
</script>

<style lang='scss'>
.banners{
  width: 100%;
  height: auto;
}


#home{
  height: 100vh;
  position: relative;
}

.wrapper{
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0; 
  overflow: hidden;
}

</style>