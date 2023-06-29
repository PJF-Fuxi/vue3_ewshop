import { request } from "./request";

export function register(data: any){
    return request({
        url:'/api/auth/register',
        method:'post',
        data
    })
}

export function login(data: any){
    return request({
        url:'/api/auth/login',
        method:'post',
        data
    })
}

export function logout(){
    return request({
        url:'/api/auth/logout',
        method:'post'
    })
}

export function getUserDetail(){
    return request({
        url:'/api/user',
    })
}
// body请求参数 name :string
export function updateUserDetail(data:string){
    return request({
        url:'/api/user',
        method:'put',
        data
    })
}