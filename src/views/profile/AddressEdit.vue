<template>
    <div class="address-edit-box">
        <nav-bar class="nav-bar">
        <template v-slot:default>{{title}}</template>
        </nav-bar>

        <van-address-edit
            :area-list="areaList"
            :show-delete="type=='edit'"
            :address-info="addressInfo"
            show-set-default
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
            @change-detail="onChangeDetail"
        />       
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs,computed } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import { showToast, showSuccessToast} from 'vant';
import {useStore} from 'vuex';
import {useRouter,useRoute} from 'vue-router';
// Vant 提供了一份中国省市区数据，你可以安装 @vant/area-data npm 包来引入：npm i @vant/area-data
import {areaList} from '@vant/area-data';
import {addAddress,addressUpdate,deleteAddress,addressDetail,addressList} from '@/network/address'
export default defineComponent({
    name:'AddressEdit',
    components:{
        NavBar,
    },
    setup(){
        const route=useRoute()
        const router=useRouter()
        const state=reactive({
            type:'add',
            addressId:'',
            title:'',
            addressInfo:{}
        })

        onMounted(()=>{
            // 接收参数
            const type=route.query.type;
            state.type=type;
            state.title=computed(()=>{
                return state.type=='add'?'新增地址':'编辑地址'
            })

            if(type=='edit'){
                const addressId=route.query.addressId;
                state.addressId=addressId;

                addressDetail(addressId).then(res=>{
                    let _areaCode = getAreaCode(res.county);
                    state.addressInfo={
                        name:res.name,
                        tel:res.phone,
                        province:res.province,
                        city:res.city,
                        county:res.county,
                        areaCode:_areaCode,
                        addressDetail:res.address,
                        // isDefault:!!res.is_default
                        isDefault:!!res.is_default
                    }
                })
            }
        })
        

         //获取对应区获取区域代码
        function getAreaCode(county){
            var id = "";
            //通过抛出异常来中断,以此来提高速度
            Object.keys(areaList.county_list).forEach(itemKey=>{
                try {
                if(areaList.county_list[itemKey] === county){
                    throw new Error(itemKey);
                }
                } catch (error) {
                id = error.message;
                }
            });
            return id;
        }

        const onSave = (res) => {
            const addressData={
                name:res.name,
                phone:res.tel,
                province:res.province,
                city:res.city,
                county:res.county,
                address:res.addressDetail,
                is_default:res.isDefault? 1:0               
            }
            if(state.type=='edit'){
                // 修改地址
                addressUpdate(state.addressId,addressData)
            }else if(state.type=='add'){
                 // 调用接口添加地址
                addAddress(addressData)
            }
            showSuccessToast({
                message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>保存成功</span></div>`,
                type: 'html'
            });
            setTimeout(()=>{
                router.back();
            },1000)
        }
        
        const onDelete = () =>{
            deleteAddress(state.addressId)
            showSuccessToast({
                message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-success" style="font-size:16px;margin-right:5px"></i><span>删除成功</span></div>`,
                type: 'html'
            });
            setTimeout(()=>{
                router.back();
            },1000)
        }
        const onChangeDetail = (val) => {

        }
      
        return{
            ...toRefs(state),
            areaList,
            onSave,
            onDelete,
            onChangeDetail
        }
    }
  })
</script>
  
<style lang='scss'>
.edit{
    .van-filed__body{
        textarea{
            height:2px !important
        }
    }

}
.address-edit-box{
    margin-top:44px;
    .van-address-edit{

    }
    // .van-button{
    //         background:var(--color-tint);
    //         border-color: var(--color-tint);
    //     }
}
</style>
  
  