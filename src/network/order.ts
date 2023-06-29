import { request } from "./request";

// 创建订单
// data:address_id
export function createOrder(data:any){
    return request({
        url:'/api/orders',
        method:'post',
        data
    })
}

// 订单预览
export function orderPreview(){
    return request({
        url:'/api/orders/preview'
    })
}

// 获取支付二维码
// type:支付类型，只能是：aliyun， wechat
export function payOrder(orderId:number,data: any){
    return request({
        url:`/api/orders/${orderId}/pay?`+data,
    })
}

// 查询支付状态
export function payOrderStatus(id:number){
    return request({
        url:`/api/orders/${id}/status`
    })
}

// 订单列表
// title:标题模糊搜索      status:订单状态: 1下单 2支付 3发货 4收货 5过期   include:包含额外的数据： goods 商品，user 用户 ，orderDetails订单详情
// page:1,title:string,status:number,include:string
export function getOrderList(data:any){
    return request({
        url:'/api/orders',
        data
    })
}

// 订单详情
// include:包含额外的数据： goods 商品，user 用户 ，orderDetails订单详情, address 订单相关的地址
export function getOrderDetail(id:number){
    return request({
        url:`/api/orders/${id}`
    })
}

// 确认收货
export function confirmOrder(id:number){
    return request({
        url:`/api/orders/${id}/confirm`,
        method:'patch'
    })
}

// 物流详情
export function getExpressDetail(id:number){
    return request({
        url:`/api/orders/${id}/express`
    })
}



// // 评价商品
// export function orderComments(id:number,data:any){
//     return request({
//         url:`/api/orders/${id}/comment`,
//         method:'',
//         data
//     })
// }

// // 模拟支付
// // type:支付类型，只能是：aliyun， wechat
// export function payTest(id:number,type:string){
//     return request({
//         url:`/api/orders/${id}/paytest?type=`+type
//     })
// }

