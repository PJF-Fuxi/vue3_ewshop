<template>
  <div>
      <nav-bar>
      <template v-slot:default>账号登录</template>
      </nav-bar>
      <div>
          <van-image  class="iconImg"
              width="5rem"
              fit="contain"
              :src="require('@/assets/images/login.png')"
          />
      </div>
      <div>
          <van-form @submit="onSubmit">
              <van-cell-group inset>
                  <van-field
                  v-model="email"
                  name="电子邮箱"
                  label="电子邮箱"
                  placeholder="请输入电子邮箱"
                  :rules="[{ required: true, message: '请填写电子邮箱' }]"
                  />
                  <van-field
                  v-model="password"
                  type="password"
                  name="密码"
                  label="密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
                  />
              </van-cell-group>
              <div style="margin: 16px;">
                  <div class="link-login" @click="$router.push({path:'/register'})">
                      没有账号？点击注册
                  </div>
                  <van-button round block color="#42b983" type="primary" native-type="submit">
                  登录
                  </van-button>
              </div>
          </van-form>

      </div>
  </div>
</template>
 
<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import {login} from '@/network/user';
import { showToast, showSuccessToast} from 'vant';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
export default defineComponent({
  name:'Login',
  components:{
      NavBar,
  },
  setup(){
    const router=useRouter();
    const store=useStore();

      const userInfo=reactive({
          email:'',
          password:''
      })

      const onSubmit=()=>{
        login(userInfo).then(res=>{
          // 将token保存到本地 window.localStorage   setItem(key,value) getItem(key)
          window.localStorage.setItem('token',res.access_token);

          // 在vuex中存储isLogin标记当前登陆状态  
          store.commit('setIsLogin', true)

          showSuccessToast({
            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>登录成功</span></div>`,
            type: 'html'
          });
          userInfo.email='';
          userInfo.password='';
          setTimeout(()=>{
              router.push({path:'/profile'})
          },1000)

        }).catch(err=>{
          
        })
      }
  
  return{
      ...toRefs(userInfo),
      onSubmit,
  }

  }
})
</script>

<style lang='scss'>
  .iconImg{
      margin: 60px 0 20px 0;
      text-align: center;
  }
  .link-login{
      font-size: 12px;
      margin-bottom: 20px;
      color: #42b983;
  }

</style>

