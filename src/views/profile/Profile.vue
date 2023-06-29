<template>
  <div>
   <nav-bar>
     <template v-slot:default>个人中心</template>
   </nav-bar>

   
   <div class="user">
      <div class="img-box"><img class="img" v-lazy="user.avatar_url" alt=""></div>
      <div class="user-card">
        <p style="margin-bottom: 10px;">昵称：{{ user.name }}</p>
        <p>邮箱：{{ user.email }}</p>
      </div>
   </div>
   <div class="list">
    <ul>
      <li @click="goTo('/updateUser')">
        <div>账号设置</div>
        <img src="@/assets/images/right.png" alt="">
      </li>
      <li @click="goTo('/orderdetail')">
        <div>我的订单（功能未完善、服务器报错）</div>
        <img src="@/assets/images/right.png" alt="">
      </li>
      <li @click="goTo('/address')">
        <div>地址管理</div>
        <img src="@/assets/images/right.png" alt="">
      </li>
    </ul>
   </div>
  
   <div class="logout">
      <van-button round block color="#42b983" @click="toLogout">退出登录</van-button>
  </div>

  </div>
 </template>
 
 <script>
 import { defineComponent ,reactive ,onMounted,toRefs} from 'vue';
 import NavBar from '@/components/common/navbar/NavBar.vue';
 import { useRouter} from 'vue-router';
 import {logout,getUserDetail} from '@/network/user';
 import { showSuccessToast} from 'vant';
 import {useStore} from 'vuex';
 export default defineComponent({
   name:'Profile',
   components:{
     NavBar
   },
 
   setup(){
    const router=useRouter();
    const store=useStore();
    const state=reactive({
      user:{}
    });

    const init=()=>{
      getUserDetail().then(res=>{
        state.user=res;
      })
    }

    onMounted(()=>{
      init();
    })

    // 公用跳转方法
    const goTo=(path,query)=>{
      router.push({path,query:query || {}})
    }

    const toLogout=()=>{
      logout().then(res=>{
        if(res && res.status=='204'){
          showSuccessToast({
              message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>退出成功</span></div>`,
              type: 'html'
          });
          window.localStorage.removeItem('token');
          store.commit('setIsLogin', false)
          setTimeout(()=>{
            router.push({path:'/login'})
          },1000)
        }
      })
    }
 
     return{
      ...toRefs(state),
      toLogout,
      goTo,
     }
 
   }
 })
 </script>
 
 <style lang='scss'>
 .user{
    width: 90%;
    margin: auto;
    margin-top: 50px;
    display: flex;
    align-items: center;
    background-color: #42bFAA;
    box-shadow: 2px 2px 3px;
    border-radius: 10px;
   
    .img-box{
      display: flex;   
      flex: 1;
      .img{
      flex: 1;
      transform: scale(0.8);
      }
    }
    
    .user-card{
      flex: 2;
      font-size: 1em;
      margin-left: 10px;
      color: white;
      text-align: left;
    }
 }

 .list{
    display: flex;
    justify-content: center;
    margin-top:20%;
    
    ul{
      width: 90%;
      li{
      display: flex;
      align-items: center;
      margin: 5vh 0;
      
      div{
        font-size: 1em;
      }

      img{
        width: 45px;
        padding: 12px;
        position: absolute;
        right: 0;
      }
    }
    }
 }
 .logout{
    width: 90vw;
    margin: auto;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 10vh;
 }
 </style>

