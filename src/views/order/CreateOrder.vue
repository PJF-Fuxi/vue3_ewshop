<template>
    <div id="create-order">
    <NavBar class="nav-bar">
      <template v-slot:default> 订单预览 </template>
    </NavBar>
    <!-- 展示地址部分 -->
    <div class="address-wrap" @click="goTo">
      <div class="name">
        <span>{{address.name}}&nbsp;</span>
        <span>{{address.phone}}</span>
      </div>
      <div class="address">
        {{ address.province }} {{ address.city }} {{ address.county }} {{ address.address }}
      </div>
      <!-- 跳转到地址管理 -->
      <van-icon class="arrow" name="arrow"/>
    </div>

    <div class="good">
      <!-- 商品列表 -->
      <div class="good-item" v-for="(item,index) in cartList" :key="index">
        <!-- 商品图片 -->
        <div class="good-img">
          <!-- <img v-lazy="item.goods.cover_url" :alt="item.goods.title" /> -->
          <img v-lazy="item.goods.cover_url" :alt="item.goods.title">
        </div>
        <!-- 商品描述 -->
        <div class="good-desc">
          <div class="good-title">
            <span>{{item.goods.title}}</span>
            <span>x{{ item.num }}</span>
          </div>
          <div class="good-btn">
            <div class="price">
              <small>¥</small>{{ item.goods.price * item.num }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-submit-bar
      class="submit-all"
      :price="totalPrice * 100"
      button-text="确认订单"
      @submit="handleCreateOrder"
    >
      商品金额
    </van-submit-bar>

    <!-- 支付二维码 -->
    <van-popup
      closeable
      :close-on-click-overlay="false"
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '25%' }"
      @close="closePay"
    >

    <van-grid :border="false" :column-num="2">
        <van-grid-item>
            支付宝二维码<br>
            <!-- <van-image width="150" height="150" :src="aliyun" /> -->
            <van-image width="150" height="150" :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
            <!-- 接口原因~也换为支付宝 -->
            微信二维码(支付宝)<br>
            <!-- <van-image width="150" height="150" :src="wechat" /> -->
            <van-image width="150" height="150" :srcy="aliyun" />
        </van-grid-item>
    </van-grid> 

    </van-popup>
  </div>
</template>

<script>
import { defineComponent,reactive, onMounted, toRefs, computed,ref } from 'vue';
import NavBar from "@/components/common/navbar/NavBar";
import {useRouter,useRoute } from "vue-router";
import { useStore } from "vuex";
import { showToast, showSuccessToast,showLoadingToast,closeToast} from 'vant';
import { createOrder,orderPreview,payOrder,payOrderStatus,getOrderList,getOrderDetail,confirmOrder,getExpressDetail} from "@/network/order";
export default defineComponent({
    name:'CreateOrder',
    components:{
        NavBar
    },

    setup(){
      const router=useRouter()
      const route=useRoute()
      const store=useStore()
      const state=reactive({
          cartList:[],
          address:{},
          totalPrice:'',
          showPay:false,
          orderId:'',
          aliyun:'',
      })

      const init=()=>{
          showLoadingToast({
              message: '加载中...',
              forbidClick: true,                
              className: 'particulars-detail-popup'
          });
          orderPreview().then(res=>{
              // 1、获取地址信息
                // vue3不支持filter
                // let address=res.address.filter(item => {item.is_default=='1'});
              let address=res.address.map((item) => {
                  if (item.is_default==1) {
                      return item;
                  }
              })
              // if(address.length==0){
              if(address[0]==undefined){
                  state.address={
                      name:'还没有设置默认地址，请选择或填写地址信息!',
                      phone:'',
                      province:'',
                      city:'',
                      county:'',
                      address:''
                  }
              }else{
                  state.address=address[0]
              }

              // 2、获取购物车信息
              state.cartList=res.carts;

              // 3、获取商品总价
              state.totalPrice=computed(()=>{
                  let sum=0;
                  state.cartList.forEach(item => {
                      sum+=item.num*item.goods.price;
                  });
                  return sum;
              })
              closeToast();
          })
      }
      // 选择地址
      const goTo=()=>{
          router.push({path:'/address'})
      } 
      // 提交订单
      const handleCreateOrder=()=>{
        const params={address_id: state.address.id};
        createOrder(params).then(res=>{
            showSuccessToast({
              message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>创建订单成功</span></div>`,
              type: 'html',
              className: 'particulars-detail-popup'
            });
            store.dispatch('updateCartCount');
            setTimeout(() => {
              closeToast();
            }, 200);

            state.showPay=true;
            // 订单ID
            state.orderId=res.id;

            // 临时性跳转用
            router.push({path:'/orderdetail',query:{id:state.orderId}})

            // 服务器出错，一直报500，获取不到二维码
            // payOrder(state.orderId,'type=aliyun').then(res=>{
            //   state.aliyun=res.qr_code_url;
            // })

            // // 轮询查看
            // const timer=setInterval(() => {
            //   payOrderStatus(state.orderId).then(res=>{
            //     if(res=='2'){
            //       clearInterval(timer);
            //       router.push({path:'/orderdetail',query:{id:state.orderId}})
            //     }
            //   })
            // }, 2000);
        })
      }

      const closePay=()=>{

      }
      
      onMounted(()=>{
          init();
      })

      return{
          ...toRefs(state),
          goTo,
          handleCreateOrder,
          closePay,
      }

    }
})
</script>

<style lang='scss'>
#create-order {
  background: #f9f9f9;
  :deep(.van-toast){
    background-color:red!important;
  }
  .address-wrap {
    text-align: left;
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    margin-top: 44px;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name,
    .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
        135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      content: "";
    }
  }
  .good {
    margin-bottom: 120px;
  }
  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        width: 100px;
        height: auto;
      }
    }
    .good-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;
      .good-title {
        display: flex;
        justify-content: space-between;
      }
      .good-btn {
        display: flex;
        justify-content: space-between;
        .price {
          font-size: 16px;
          color: red;
          line-height: 28px;
        }
        .van-icon-delete {
          font-size: 20px;
          margin-top: 4px;
        }
      }
    }
  }
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}
.submit-all {
  position: fixed;
  bottom: 50px;
  z-index: 9 !important;
}
.particulars-detail-popup {
  background: rgba(0, 0, 0, 0.7) !important;
}
</style>