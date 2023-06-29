import { request } from "./request";
// 添加地址
export function addAddress(data: any){
    return request({
        url:'/api/address',
        method:'post',
        data
    })    
}

// 地址列表
export function addressList(){
    return request({
        url:'/api/address',
        method:'get'
    })
}

// 地址详情
export function addressDetail(id:number){
    return request({
        url:`/api/address/${id}`,
        method:'get'
    })
}

// 更新地址
export function addressUpdate(id:number,data:any){
    return request({
        url:`/api/address/${id}`,
        method:'put',
        data
    })
}

// 删除地址
export function deleteAddress(id:number){
    return request({
        url:`/api/address/${id}`,
        method:'delete'
    })
}