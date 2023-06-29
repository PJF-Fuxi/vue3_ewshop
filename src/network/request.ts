import axios from "axios";
import {useRouter} from 'vue-router';
import router from "@/router";
import { showToast ,showFailToast } from 'vant';

export function request(config: any){
    // const router=useRouter();  // useRouter只能在setup(){}中使用，不然会报undefined

    const instance=axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:5000
    })

    //请求拦截
    instance.interceptors.request.use(config=>{
        //如果有一个接口需要认证才可以访问，就在这里统一设置
        const token=window.localStorage.getItem('token');
        if(token){
            config.headers.Authorization='Bearer'+token
        }

        //直接放行
        return config;
    },err=>{

    })

    //响应拦截
    instance.interceptors.response.use(response=>{
        return response.data?response.data:response;
    },err=>{
        if(err.response.status=='401'){
            if(router.currentRoute.value.path=='/login'){
                showFailToast({
                    message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>账号或密码错误</span></div>`,
                    type: 'html'
                });
            }else{
                showFailToast({
                    message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>请先登录账号</span></div>`,
                    type: 'html'
                });
                setTimeout(()=>{
                    router.push({path:'/login'})
                },1000)
            }
           
        }else{
            showToast(err.response.data.errors[
                Object.keys(err.response.data.errors)[0]][0]
            )
            // showFailToast({
            //     message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px"></i><span>操作失败,请检查网络是否正常</span></div>`,
            //     type: 'html'
            // });
        }
    } )

    return instance(config);
}