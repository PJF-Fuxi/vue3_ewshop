<template>
  <div>
    <NavBar>
      <template v-slot>购物车(<small>{{store.state.cartCount}}</small>)</template>
    </NavBar>

    <div class="cart-box">
      <!-- 商品列表 -->
      <div class="cart-body">
        <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
          <van-swipe-cell :right-width="50" v-for="(item,index) in list" :key="index">
            <!-- 商品信息 -->
            <div class="goods-item">
              <!-- 选择器 -->
              <van-checkbox class="van-checkbox" :name="item.id"></van-checkbox>
              <!-- 商品图像 -->
              <div class="good-img"><img v-lazy="item.goods.cover_url" alt="item.goods.title"></div>
              <!-- 商品详情 -->
              <div class="good-desc">
                <!-- 商品标题及库存 -->
                <div class="good-title">
                  <strong>{{item.goods.title}}</strong>
                  <span class="count">x{{ item.goods.stock }}</span>
                </div>
                <!-- 商品价格及加购数量 -->
                <div class="good-btn">
                  <span class="price"><small>￥</small>{{ item.goods.price }}</span>
                  <van-stepper class="van-stepper" integer :min="1" :max="item.goods.stock" :model-value="item.num" 
                    :name="item.id" @change="onChangeNum" input-width="1.5em" button-size="1.5em"  disable-input/>
                </div>
              </div>
            </div>
            <!-- 左滑删除键 -->
            <template #right>
              <van-button @click="deleteGood(item.id)" square icon="delete" type="danger" class="delete-button"></van-button>
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div> 

      <!-- 全选及提交订单 -->
      <van-submit-bar class="submit-all" :price="totalPrice*100" @submit="onSubmit" button-text="提交订单">
        <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
      </van-submit-bar>

      <!-- 购物车为空 -->
      <div class="empty" v-if="!list.length">
        <img class="empty-cart" src="@/assets/images/empty-car.png" alt="空购物车">
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,reactive,toRefs,onMounted,computed } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { showFailToast,showLoadingToast,closeToast  } from 'vant';
import {modifyCart,checkedCart,getCart,deleteCartItem} from '@/network/cart'
export default defineComponent({
  name:'Shopcart',
  components:{
    NavBar
  },

  setup(){
    const store=useStore();
    const router=useRouter();

    // 数据模型
    const state=reactive({
      list:[] as any[],
      result:[] as any[], //id数组
      checkAll:false
    })

    // 初始化购物车数据
    const init=()=>{
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        className: 'particulars-detail-popup'
      });
      getCart('include=goods').then(res=>{
        state.list=res.data;  
        res.data.forEach((item: { is_checked: number; id: any; })=>{
          if(item.is_checked==1){
            state.result.push(item.id)
          }
        })    
        // 判断全选框是否该打勾
        if(state.result.length==state.list.length){
          state.checkAll=true;
        }else {
          state.checkAll=false;
        }
                    
        closeToast();
      })
      
    }

    // 异步改变购物车数量
    const onChangeNum=(num: any,id: { name: string; })=>{
      modifyCart(id.name,{num}).then(res=>{
        // onMouted中init()里面的list.num也要修改
        state.list.forEach(item=>{
          if(item.id==id.name){
            item.num=num
          }
        })
      })
    }

    // 复选框改变处理
    const groupChange=(result: number[])=>{
      state.result=result;
      checkedCart({cart_ids:result});   
      if(state.result.length==state.list.length){
        state.checkAll=true;
      }else {
        state.checkAll=false;
      }
    }

    // 全选/全不选
    const allCheck=()=>{
      if(state.checkAll){
        state.result=state.list.map(item=>item.id);           
      }else {
        state.result=[];
      }      
    }

    // 删除商品
    const deleteGood=(id:number)=>{
      deleteCartItem(id).then(res=>{
        init();  //重新初始化
        store.dispatch('updateCartCount')
      })
    }

    // 计算总价
    const totalPrice=computed(()=>{
      let sum=0;
      state.list.forEach(item=>{
        if(state.result.includes(item.id)){
          sum+=item.goods.price*item.num;
        }
      })
      return sum;
    })

    // 提交订单
    const onSubmit=()=>{
      if(state.result.length==0){
        showFailToast({
            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>请先选择商品</span></div>`,
            type: 'html',
            className: 'particulars-detail-popup'
        });
      }else {
        router.push({path:'/createorder'}) 
      }
    }

    // 前往购物
    const goTo=()=>{
      router.push({path:'/home'})
    }

    onMounted(()=>{
      init();
    })

    return{
      store,
      ...toRefs(state),
      goTo,
      onChangeNum,
      groupChange,
      allCheck,
      deleteGood,
      totalPrice,
      onSubmit,
      

      
    }

  }
})
</script>

<style lang='scss'>
.cart-box{
  display: flex;
  margin-top: 45px;
  // 商品列表
  .cart-body{
    width: 100%;
    .goods-item{
      width: 100%;
      display: flex;
      padding: 5px;
      align-items: center;//垂直居中
      // 选择器
      .van-checkbox{
        flex: 1;
        // margin: auto;
        position: fixed;
        left: 3vw;
      }
      // 商品图像
      .good-img{
        flex: 2;
        margin-left: 5vw;
        img{          
          object-fit: cover;//图片自适应
        }
      }
      // 商品详情
      .good-desc{
        flex: 6;
        font-size: 0.8em;
        // 商品标题及库存
        .good-title{
          display: flex;
          align-items: center;
          margin-bottom: 15px; //商品标题和价格之间的空隙
          .count{
            position: fixed; //库存靠右
            right: 5vw;
          }
        }
        // 商品价格及加购数量
        .good-btn{
          display: flex;
          align-items: center;
          .price{
            color: red;
          }
          .van-stepper{
            position: fixed;//步进器靠右
            right: 5vw;
          }
        }
      }
    }
    .delete-button{
      height: 100%;
    }
  }
  // 全选及提交订单
  .submit-all{
    position: fixed;
    bottom: 50px;
    z-index: 10;
  }
  //购物车为空 
  .empty {
    width: 50%;
    // margin: 0 auto;
    // text-align: center;
    // position: relative;
    position: fixed;
    top: 20%;
    left: 25%;

    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .title{
      margin-bottom: 10px;
    }
  }
}
.particulars-detail-popup {
  background: rgba(0, 0, 0, 0.7) !important;
}
</style>