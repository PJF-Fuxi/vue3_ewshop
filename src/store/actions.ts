import { getCart } from "@/network/cart";
const actions={
    updateCartCount(context: { commit: (arg0: string, arg1: any) => void; }){
        getCart().then(res=>{
            context.commit('addCart',res.data.length || 0)
        })
    }
}
export default actions;