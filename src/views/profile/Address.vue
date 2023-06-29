<template>
    <div class="address-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>地址管理</template>
        </nav-bar>

        <div class="address-empty" v-show="list.length==0">
           还没有地址信息，快去添加吧！
        </div>

        <div class="address-item">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {addressList} from '@/network/address';
export default defineComponent({
    name:'Address',
    components:{
        NavBar,
    },
    setup(){
        const router=useRouter()

        const state=reactive({
            chosenAddressId:'1',
            list:[] 
        })
        const onAdd = () =>{
            router.push({path:'addressedit',query:{type:'add'}})
        }
        const onEdit = (item) =>{
            router.push({path:'/addressedit',query:{type:'edit',addressId:item.id}})
        }
        onMounted(()=>{
            addressList().then(res=>{
                if (res.data.length==0) {
                    // state.list=[]
                    return;
                }
                state.list=res.data.map(item=>{
                    return{
                        id:item.id,
                        name:item.name,
                        tel:item.phone,
                        // address:item.province+item.city+item.county+item.address,
                        address:`${item.province} ${item.city} ${item.county} ${item.address}`,
                        // isDefault:item.is_default==1?true:false
                        isDefault:!!item.is_default
                    }
                })
            })
        })  
        return{
            ...toRefs(state),
            onAdd,
            onEdit
        }
    }
})
</script>

<style lang='scss'>
.address-box{
    .van-radio__icon{
        display: none;
    }
    .address-item{
        margin-top: 45px;
        .van-button{
            background:var(--color-tint);
            border-color: var(--color-tint);
        }
    }
    .address-empty{
        margin: auto;
        margin-top:50%;
        font-size: large;
    }
}
.van-address-list__bottom{
    bottom: 100px !important;
}
</style>

