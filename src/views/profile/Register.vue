<template>
    <div>
        <nav-bar>
        <template v-slot:default>账号注册</template>
        </nav-bar>
        <div>
            <van-image  class="iconImg"
                width="5rem"
                fit="contain"
                :src="require('@/assets/images/register.png')"
            />
        </div>
        <div>
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="请输入用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                    />
                    <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                    />
                    <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="请确认密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                    />
                    <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="请输入电子邮箱"
                    :rules="[{ required: true, message: '电子请填写邮箱' }]"
                    />
                </van-cell-group>
                <div style="margin: 16px;">
                    <div class="link-login" @click="$router.push({path:'/login'})">
                        已有账号？点击登录
                    </div>
                    <van-button round block color="#42b983" type="primary" native-type="submit">
                    注册
                    </van-button>
                </div>
            </van-form>

        </div>
    </div>
</template>
   
<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import {register} from '@/network/user';
import { showToast, showSuccessToast} from 'vant';
import {useRouter} from 'vue-router';
export default defineComponent({
    name:'Register',
    components:{
        NavBar,
    },
    setup(){
        const router = useRouter();
        const userInfo=reactive({
            name:'',
            password:'',
            password_confirmation:'',
            email:''
        })

        const onSubmit=()=>{
            if(userInfo.password!=userInfo.password_confirmation){
                showToast({
                    message: '两次密码不一致！'
                });
            }else{
                register(userInfo).then(res=>{
                    // 注册成功
                    if(res.status=='201'){
                        showSuccessToast({
                            message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>注册成功</span></div>`,
                            type: 'html'
                        });
                        setTimeout(()=>{
                            router.push({path:'/login'})
                        },1000)
                    }
                    userInfo.password='';
                    userInfo.password_confirmation='';
                }).catch(err=>{

                })
            }
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
  
  