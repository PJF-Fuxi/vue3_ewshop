const mutations={
    setIsLogin(state: { user: { isLogin: boolean; }; },payload: boolean){
        state.user.isLogin=payload
    },
    addCart(state: { cartCount: number; },payload: number){
        state.cartCount=payload
    }
}
export default mutations;