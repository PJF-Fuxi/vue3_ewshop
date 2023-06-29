<template>
  <div>
    <NavBar>
      <template v-slot>商品分类</template>
    </NavBar>
    <div id="mainbox">
      <TabControl class="ordertab" @tabClick="tabClick" :titles="['销量排序','价格排序','评论排序']"></TabControl>

      <van-sidebar class="leftmenu" v-model="activeKey">
        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item v-for="item in category" :key="item.id" :title="item.name" :name="item.name">
            <van-sidebar-item v-for="sub in item.children" :title="sub.name" :key="sub.id" @click="getGoods(sub.id)" />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>

      <div class="goodslist">
        <div class="content">
          <van-card
           v-for="item in showGoods" :key="item.id"
           @click="itemClick(item.id)"
            :num="item.comments_count"
            :tag="item.comments_count>0?'流行':'冷门'"
            :price="item.price+'.00'"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>
    <BackTop @bTop="bTop" v-show="isTabFixed"></BackTop>
  </div>
</template>

<script>
import { defineComponent,onMounted,ref ,computed,reactive,watchEffect,nextTick } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import TabControl from '@/components/content/tabControl/TabControl.vue';
import { getCategoryAllData ,getCategoryGoods} from '@/network/category';
import BScroll from 'better-scroll';
import BackTop from '@/components/common/backtop/BackTop.vue';
import {useRouter} from 'vue-router';
export default defineComponent({
  name:'Category',
  components:{
    NavBar,
    TabControl,
    BackTop
  },

  setup(){
    let category=ref([]);
    let activeKey=ref(0);
    let activeNames=ref(1);
    let active=ref(1);
    // 排序条件
    let currentType=ref('sales');
    // 分类条件
    let currentCid=ref(0);
    // 上拉加载
    let bscroll=reactive({});

    let isTabFixed=ref(false);

    const router=useRouter();

    const bTop=()=>{
      // 回到顶部的滚动方法：scrollTo()
      bscroll.scrollTo(0,0,300);
    }

    // 数据模型
    const goods=reactive({
      sales:{page:1,list:[]},
      price:{page:1,list:[]},
      comments_count:{page:1,list:[]},
    })

    const showGoods=computed(()=>{
      return goods[currentType.value].list;
    })

    const init=()=>{
      getCategoryGoods('sales',currentCid.value).then(res=>{
        goods.sales.list=res.goods.data;
      })

      getCategoryGoods('price',currentCid.value).then(res=>{
        goods.price.list=res.goods.data;
      })

      getCategoryGoods('comments_count',currentCid.value).then(res=>{
        goods.comments_count.list=res.goods.data;
      })
    }

    // 排序选项卡
    const tabClick = (index) => {
      let type = ['sales','price','comments_count'];
      currentType.value = type[index];
      getCategoryGoods(currentType.value,currentCid.value).then(res=>{
        goods[currentType.value].list= res.goods.data;
      })
      nextTick(()=>{
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    }

    // 通过分类得到商品
    const getGoods=(cid)=>{
        currentCid.value=cid;
        init();
    }    

    // 商品详情
    const itemClick=(id)=>{
      router.push({path:'/detail',query:{id}});
    }
    
    onMounted(()=>{
      getCategoryAllData().then(res => {
        category.value = res.categories ; 
      })
      init();

      // 创建BeeterScrool对象
      bscroll = new BScroll(document.querySelector('.goodslist'),{
        probeType: 3,  // 0,1,2,3  3就是只要在运行时就出发scroll事件
        click: true,  // 是否允许点击
        pullUpLoad: true  // 上啦加载更多，默认是false
      })
      // 触发滚动事件
      bscroll.on('scroll',(position) => {
        isTabFixed.value = (-position.y) > (document.querySelector('.ordertab').offsetHeight);       
      })
      // 上拉加载数据，触发pullingup
      bscroll.on("pullingUp",() => {
        const page = goods[currentType.value].page + 1;
        getCategoryGoods(currentType.value,currentCid.value,page).then(res => {
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page = page;
        })
        // 完成上拉，等数据请求完成，要将新数据展示出来
        bscroll.finishPullUp();
        nextTick(()=>{
        // 重新计算高度
        bscroll && bscroll.refresh()
        })
          // 重新计算高度
          bscroll.refresh();
        })

    // 监听任何变量
    watchEffect(()=>{
      nextTick(()=>{
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    })


    })
    return{
      category,
      tabClick,
      activeKey,
      activeNames,
      active,
      currentType,
      getGoods,
      currentCid,
      goods,
      showGoods,   
      bTop,
      isTabFixed,
      itemClick,


      
    }

  }
})
</script>

<style lang='scss'>
#mainbox{
  margin-top: 45px;
  display: flex;
  

  .ordertab{
    width: 75vw;
    position: fixed;
    top: 45px;
    right: 0;

    
  }
  .leftmenu{
    width: 30vw;
    margin-top: 40px;
    position: fixed;
    left: 0;
  }
  .goodslist{
    position: fixed;
    right: 0;
    width: 70vw;
    height:100vh;
    margin-top: 40px;
    padding: 10px;
    text-align: left;

    // .van-card_content{
      
    // }
  }

}
</style>