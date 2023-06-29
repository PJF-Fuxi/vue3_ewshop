<template>
  <div>
    <NavBar>
      <template v-slot>图书详情</template>
    </NavBar>

    <van-image class="deatilImg"
      lazy-load
      :src="detail.cover_url"
    />

    <van-card class="vanCard"
      :num="detail.stock"
      :price="detail.price+'.00'"
      :desc="detail.description"
      :title="detail.title"
    >
      <template #tags>
        <van-tag plain type="danger">标签</van-tag>
        <van-tag plain type="danger">标签</van-tag>
      </template>
      <template #footer >
        <van-button class="vanButton" type="warning" @click="handleAddCart">加入购物车</van-button>
        <van-button class="vanButton" type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>

    <van-tabs>
      <van-tab title="概述">
        <div class="details" v-html="detail.details"></div>
      </van-tab>
      <van-tab title="热评">
        <div class="comments">
          <div v-if="comments.length">
            <div v-for="(item,index) in comments" :key="index">
              <div class="userInfo">
                <img v-lazy="item.user.avatar_url" alt="">
                <span class="userName">{{item.user.name}}</span>
              </div>
              <div class="comment">
                <div class="title">已购：{{ detail.title }}</div>
                <div class="date">{{ item.updated_at }}</div>
              </div>
              <div class="comment">
                  {{ item.content }}
              </div>
            </div>
          </div>
          <div v-else>
            暂无评论
          </div>
        </div>
        
      </van-tab>
      <van-tab title="相似图书">
        <GoodsList  :goods="like_goods"></GoodsList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { defineComponent ,ref,onMounted, reactive,toRefs} from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import TabControl from '@/components/content/tabControl/TabControl.vue';
import GoodsList from '@/components/content/goods/GoodsList.vue';
import {addCart,modifyCart,checkedCart,getCart,deleteCart} from '@/network/cart';
import {getDetailData} from '@/network/detail';
import { useRoute ,useRouter} from 'vue-router';
import {useStore} from 'vuex';
import { showSuccessToast ,showFailToast,closeToast } from 'vant';

export default defineComponent({
  name:'Detail',
  components:{
    NavBar,
    TabControl,
    GoodsList
  },

  setup(){
    const route=useRoute();
    const router=useRouter();
    const store=useStore();

    let id=ref(0);
    id.value=route.query.id;

    let book=reactive({
      detail:{},
      like_goods:[],
      comments:[]
    })

    const active = ref(0);

    onMounted(()=>{
      getDetailData(id.value).then(res=>{
        book.detail=res.goods;
        book.like_goods=res.like_goods;
        book.comments=res.goods.comments;
      })
    })
    // 添加购物车
    const handleAddCart=()=>{
      // 当前还未登录，先登录再加购物车
      if(!store.state.user.isLogin){
        showFailToast({
            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>请先登录账号</span></div>`,
            type: 'html',
            className: 'particulars-detail-popup'
        });
        setTimeout(()=>{
            router.push({path:'/login'})
        },1000)
      }
      // 当前为登录状态
      addCart({goods_id:book.detail.id,num:1}).then(res=>{
        if(res.status=='201' || res.status=='204'){
          showSuccessToast({
            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>添加成功</span></div>`,
            type: 'html',
            className: 'particulars-detail-popup'
          });
          store.dispatch('updateCartCount');
          setTimeout(()=>{
            closeToast();
          },200)
        }
      })

    }

    // 直接购买
    const goToCart=()=>{
      // 当前还未登录，先登录再购买商品
      if(!store.state.user.isLogin){
        showFailToast({
            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>请先登录账号</span></div>`,
            type: 'html',
            className: 'particulars-detail-popup'
        });
        setTimeout(()=>{
            router.push({path:'/login'})
        },1000)
      }
      // 当前为登录状态
      addCart({goods_id:book.detail.id,num:1}).then(res=>{
        if(res.status=='201' || res.status=='204'){
          store.dispatch('updateCartCount');
          router.push({path:'/shopcart'})
        }
      })

    }

    return{
      id,
      ...toRefs(book),
      active,
      handleAddCart,
      goToCart
    }

  }
})
</script>

<style lang='scss'>
.deatilImg{
  width: 80%;
  margin: 45px 0 0 0;
}
.vanCard{
  text-align: left;
  border-radius: 20px;
  padding: 0 20px;
  // border: 1px solid red;
}
.vanButton{
  font-size: 1em;
  width: 65px;
  height: 30px;
  padding: 0;
}
.details{
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  img{
    max-width: 100%;
    height: auto;
  }
}
.comments{
  margin: 10px 10px 0 10px;
  font-size: 15px;
  display: flex;
  .userInfo{
    display: flex;
    text-align: center;
    align-items: center;
    img{
      width: 10%;
    }
    .userName{
      margin-left: 3%;
    }
  }
}
.comment{
    width: 96%;
    margin: 0 0 0 4%;
    display: flex;
    background-color: #F6F6F6;
    .title{
      flex:1;  
      justify-content: flex-start; 
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 0.2em;
      color: rgba($color: #000000, $alpha: 0.5);
    }
    .date{
      justify-content: flex-end;
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 0.2em;
      color: rgba($color: #000000, $alpha: 0.5);
    }
  }
  .particulars-detail-popup {
  background: rgba(0, 0, 0, 0.7) !important;
}

</style>