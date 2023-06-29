import { request } from "./request";

// 添加购物车 Body 请求参数: goods_id:number  num:string
export function addCart(data:object){
    return request({
        url:'/api/carts',
        method:'post',
        data
    })    
}

// 购物车数量改变 RESET 参数:cart:int    Body 请求参数:num:string
export function modifyCart(id:string,data:object){
    return request({
        url:`/api/carts/${id}`,
        method:'put',
        data
    })    
}

// 购物车改变选中 checked ,所有选中的id  Body 请求参数:cart_ids:array
export function checkedCart(id: any){
    return request({
        url:'/api/carts/checked',
        method:'patch',
        data:id
    }) 
}

// 获取购物车列表   Query 请求参数:include:string
export function getCart(data=''){
    return request({
        url:'/api/carts?'+data
    }) 
}

// 移出购物车   RESET 参数:cart:int
export function deleteCartItem(id:number){
    return request({
        url:`/api/carts/${id}`,
        method:'delete'
    }) 
}