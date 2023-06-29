const state={
    user:{
        isLogin:window.localStorage.getItem('token') ? true:false
    },
    cartCount:0
}
export default state;