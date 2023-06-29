import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import state from '@/store/state';
import {showFailToast } from 'vant';
const Home=()=>import('../views/home/Home.vue')
const Category=()=>import('../views/category/Category.vue')
const Detail=()=>import('../views/detail/Detail.vue')
const Profile=()=>import('../views/profile/Profile.vue')
const Shopcart=()=>import('../views/shopcart/Shopcart.vue')
const Register=()=>import('../views/profile/Register.vue')
const Login=()=>import('../views/profile/Login.vue')
const updateUser=()=>import('../views/profile/updateUser.vue')
const Address=()=>import('../views/profile/Address.vue')
const AddressEdit=()=>import('../views/profile/AddressEdit.vue')
const createOrder=()=>import('../views/order/CreateOrder.vue')
const OrderDetail=()=>import('../views/order/OrderDetail.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:"图书兄弟"
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:"图书兄弟",
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:"商品分类",
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:"图书详情"
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: Shopcart,
    meta:{
      title:"购物车",
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: createOrder,
    meta:{
      title:"创建订单",
      isAuthRequired:true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title:"订单详情",
      isAuthRequired:true
    }
  },


  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:"个人中心",
      isAuthRequired:true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:"地址管理",
      isAuthRequired:true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta:{
      title:"地址编辑",
      isAuthRequired:true
    }
  },
  {
    path: '/updateUser',
    name: 'UpdateUser',
    component: updateUser,
    meta:{
      title:"修改用户昵称",
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:"账号注册"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:"账号登录"
    }
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  // 如果没有登陆，在这里到Login
  if(to.meta && to.meta.isAuthRequired && !state.user.isLogin){
    showFailToast({
      message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>请先登录账号</span></div>`,
      type: 'html'
    });
    setTimeout(()=>{
      next('./login')
    },1000)
    
  }else{
    next();
  }

  if(typeof(to.meta?.title)==='string'){
    document.title=to.meta.title;
  }
  
})

export default router
